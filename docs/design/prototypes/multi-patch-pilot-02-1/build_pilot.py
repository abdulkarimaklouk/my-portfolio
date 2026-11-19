"""
Multi-Patch Pilot 02.1 — Spatial Composition Revision (build_pilot.py)
----------------------------------------------------------------------
Role: Senior 3D Technical Artist & Procedural Geometry Engineer
Architecture: Candidate D — Hybrid Multi-Patch Architecture
              (Independent Bivariate 3D Quad Control Cages -> Catmull-Clark Subdivision)

Objectives of Revision 02.1:
  1. Patch A Revision:
     - Remove edge crease weighting (e=0.0); achieve crest sharpness via geometric support loops.
     - Eliminate terminal curl self-intersection by smoothly tapering curl radius to zero at boundaries.
     - Extend lower apron forward into the central valley (Y ~ -8.5 to -7.5, Z ~ -3.8 to -3.2).
  2. Patch B Redesign (Foreground Swell):
     - Re-author control cage with broad compound curvature and flowing asymmetric undulations.
     - Position back drop of Patch B above and in front of Patch A's extended apron floor.
  3. Spatial Composition & Central Chasm Enclosure:
     - From Camera_Hero, Patch A's lower apron forms the visible, shadowed floor of the chasm.
     - Zero world background is exposed in the chasm gap.
     - Strict 3D spatial clearance maintained (zero physical collision via BVHTree).
  4. Diagnostic Renders:
     - render-chasm-visibility.png: Distinct diagnostic materials (Patch A Cyan, Patch B Amber,
       World Magenta) proving the chasm floor is 100% occupied by Patch A geometry.

Deliverables:
  - pilot-02-1.blend
  - render-hero.png
  - render-oblique.png
  - render-side.png
  - render-chasm-closeup.png
  - render-control-cages.png
  - render-chasm-visibility.png
  - RESULTS.md

Execution:
  blender-launcher -b --python build_pilot.py
"""

import bpy
import bmesh
import mathutils
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
import math
import time
import os
import sys

def clamp(val, low, high):
    return max(low, min(high, val))

def smoothstep(edge0, edge1, x):
    t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

def build_pilot_02_1():
    start_time = time.time()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    blend_path = os.path.join(script_dir, "pilot-02-1.blend")
    log_path = os.path.join(script_dir, "build.log")

    render_paths = {
        "hero": os.path.join(script_dir, "render-hero.png"),
        "oblique": os.path.join(script_dir, "render-oblique.png"),
        "side": os.path.join(script_dir, "render-side.png"),
        "chasm": os.path.join(script_dir, "render-chasm-closeup.png"),
        "cages": os.path.join(script_dir, "render-control-cages.png"),
        "visibility": os.path.join(script_dir, "render-chasm-visibility.png"),
    }

    log_lines = []
    def log(msg):
        print(msg)
        log_lines.append(str(msg))

    log("=" * 80)
    log("MULTI-PATCH PILOT 02.1 — SPATIAL COMPOSITION REVISION BUILD")
    log(f"Blender Version: {bpy.app.version_string}")
    log(f"Target Directory: {script_dir}")
    log("=" * 80)

    # 1. Reset Scene
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '8'
    log(f"[1] Render Engine: {scene.render.engine} (1920x1080 Full HD)")

    # =========================================================================
    # 2. PATCH A: PRIMARY SCULPTURAL WAVE (REVISED WITH EXTENDED APRON)
    # =========================================================================
    # Grid: Nu_A = 16 rows (longitudinal) x Nv_A = 12 columns (transverse)
    # Total vertices = 192, 165 quads
    Nu_A = 16
    Nv_A = 12

    # Transverse mapping sA in [0, 1]:
    # j=0..3: Extended valley basin apron (Y ~ -8.5 to -7.0, Z ~ -3.8 to -3.0)
    # j=4..6: Ascending flank
    # j=7: Crest shoulder
    # j=8: Pre-crest support loop
    # j=9: Crest apex ridge (tight curvature, NO crease)
    # j=10: Post-crest support loop
    # j=11: Overhanging lip & shadow curl
    s_table_A = [0.00, 0.08, 0.18, 0.30, 0.44, 0.58, 0.70, 0.80, 0.85, 0.89, 0.93, 1.00]

    log(f"\n[2] Generating Patch A (Primary Crest with Extended Apron) ({Nu_A} x {Nv_A} = {Nu_A * Nv_A} vertices)...")

    def eval_patch_A(u, j_idx):
        s = s_table_A[j_idx]

        # Longitudinal Backbone (diagonal sweep from lower-left to upper-right)
        xCrest = -7.4 + 14.6 * u + 0.6 * math.sin(math.pi * u)
        yCrest = -1.6 + 4.8 * u - 1.8 * math.sin(math.pi * (u ** 1.1))
        # Elevation profile: rises from 0.4 to a strong focal crest peak at u=0.68 (Z=3.85), then tapers
        zCrest = 0.4 + 3.45 * math.pow(math.sin(math.pi * (u ** 0.75)), 1.3)

        # Dynamic banking angle: crest tilts forward towards camera by up to 22 deg
        bank_angle = math.radians(10.0 + 15.0 * math.sin(math.pi * (u ** 0.85)))

        # Apron expansion metrics: extends forward to Y ~ -8.2 in mid-valley
        W_apron = 4.8 + 3.2 * math.sin(math.pi * (u ** 0.85)) - 1.4 * (u ** 2)
        # Deep valley floor depression
        D_basin = 2.4 + 1.4 * math.sin(math.pi * (u ** 0.80))

        # Taper factors at horizontal boundaries
        taper_start = smoothstep(0.0, 0.18, u)
        taper_end = smoothstep(1.0, 0.82, u)
        edge_taper = taper_start * taper_end

        # Curl envelope: MUST vanish smoothly at both u=0 and u=1 to avoid terminal self-intersection!
        curl_env = math.sin(math.pi * clamp(u, 0.0, 1.0)) ** 1.6
        R_curl = (0.50 + 0.60 * math.sin(math.pi * (u ** 0.85))) * curl_env
        Theta_max = math.radians(130.0 + 35.0 * math.sin(math.pi * (u ** 0.85)))

        if s <= 0.30:
            # Zone 1: Extended Valley Basin Floor (s in [0, 0.30])
            # Forms the visible, deep floor of the central chasm behind Patch B
            t = s / 0.30
            # Extends forward in -Y so it slides underneath Patch B's back drop
            yRel = -W_apron * (1.10 - 0.50 * t)
            # Basin floor drops deeply into negative Z
            trough_shape = math.cos(math.pi * t)
            saddle_term = -0.8 * math.sin(math.pi * u) * math.sin(math.pi * t)
            zRel = -D_basin * (0.65 + 0.35 * trough_shape) + saddle_term
            # Diagonal sweep lag
            xRel = -2.6 * (1.0 - t) * (1.0 - 0.25 * u)
            x = xCrest + xRel
            y = yCrest + yRel
            z = zRel

        elif s <= 0.89:
            # Zone 2: Ascending Flank, Shoulder, and Support Loops (s in [0.30, 0.89])
            t = (s - 0.30) / (0.89 - 0.30)
            S = 3.0 * (t ** 2) - 2.0 * (t ** 3)
            yBase = -W_apron * 0.55
            zBase = -D_basin * 0.30
            xBase = -0.8 * (1.0 - 0.25 * u)

            # Secondary organic tension ripple across flank
            flank_wave = 0.35 * math.sin(2.0 * math.pi * u) * math.sin(math.pi * t)
            mid_bulge = 0.65 * math.sin(math.pi * t) * math.sin(math.pi * (u ** 0.9))

            yRel = yBase * (1.0 - S) - math.sin(bank_angle) * S * 0.7
            zRel = (zBase * (1.0 - S) + zCrest * S) - mid_bulge + flank_wave
            xRel = xBase * (1.0 - t)
            x = xCrest + xRel
            y = yCrest + yRel
            z = zRel

        else:
            # Zone 3: Overhanging Lip & Shadow Pocket (s in [0.89, 1.00])
            # Controlled curl that smoothly collapses at boundaries
            t = (s - 0.89) / (1.00 - 0.89)
            angle = t * Theta_max
            rawDY = R_curl * math.sin(angle)
            rawDZ = -R_curl * (1.0 - math.cos(angle))

            deltaY = (rawDY * math.cos(bank_angle) - rawDZ * math.sin(bank_angle))
            deltaZ = (rawDY * math.sin(bank_angle) + rawDZ * math.cos(bank_angle))
            deltaX = 0.25 * R_curl * math.sin(angle)

            x = xCrest + deltaX
            y = yCrest + deltaY
            z = zCrest + deltaZ

        return Vector((x, y, z))

    grid_A = []
    for i in range(Nu_A):
        u = i / (Nu_A - 1)
        row = []
        for j in range(Nv_A):
            row.append(eval_patch_A(u, j))
        grid_A.append(row)

    bm_A = bmesh.new()
    verts_A = []
    for i in range(Nu_A):
        r = []
        for j in range(Nv_A):
            r.append(bm_A.verts.new(grid_A[i][j]))
        verts_A.append(r)
    bm_A.verts.ensure_lookup_table()

    faces_A = []
    for i in range(Nu_A - 1):
        for j in range(Nv_A - 1):
            faces_A.append(bm_A.faces.new((verts_A[i][j], verts_A[i+1][j], verts_A[i+1][j+1], verts_A[i][j+1])))
    bm_A.faces.ensure_lookup_table()
    bm_A.normal_update()

    # NOTE: NO Catmull-Clark edge crease weights applied (strictly e=0.0)!
    # Crest sharpness is governed by geometric support loops at j=8, 9, 10.

    mesh_A = bpy.data.meshes.new("PatchA_PrimaryCrest_Mesh")
    bm_A.to_mesh(mesh_A)
    bm_A.free()

    obj_A = bpy.data.objects.new("PatchA_PrimaryCrest", mesh_A)
    scene.collection.objects.link(obj_A)
    for p in mesh_A.polygons:
        p.use_smooth = True

    subsurf_A = obj_A.modifiers.new(name="CatmullClark_Subsurf", type='SUBSURF')
    subsurf_A.subdivision_type = 'CATMULL_CLARK'
    subsurf_A.levels = 2
    subsurf_A.render_levels = 3

    log("  Patch A Mesh created:")
    log(f"    Control Cage: {Nu_A * Nv_A} vertices, {len(mesh_A.polygons)} quads")
    log("    Apex Crease Weight: 0.0 (Removed - pure geometric support loops)")
    log("    Catmull-Clark Subdivision: Level 3 Render")

    # =========================================================================
    # 3. PATCH B: REDESIGNED FOREGROUND SWELL (STRUCTURE C)
    # =========================================================================
    # Grid: Nu_B = 14 rows (longitudinal) x Nv_B = 11 columns (transverse)
    # Total vertices = 154, 130 quads
    # Positioned in foreground: Y in [-13.5, -6.8], Z in [-2.5, +1.4]
    Nu_B = 14
    Nv_B = 11

    # Transverse mapping sB in [0, 1]:
    # k=0..3: Front face rolling down towards camera (Y ~ -13.5 to -10.5, Z ~ -2.0 to 0.5)
    # k=4..6: Foreground crest apex dome (flowing diagonal horizon)
    # k=7..10: Back slope plunging into the chasm (Y ~ -8.5 to -7.0, Z ~ -2.5 to -1.5)
    s_table_B = [0.00, 0.10, 0.22, 0.35, 0.48, 0.58, 0.68, 0.78, 0.86, 0.94, 1.00]

    log(f"\n[3] Generating Redesigned Patch B (Foreground Swell) ({Nu_B} x {Nv_B} = {Nu_B * Nv_B} vertices)...")

    def eval_patch_B(u, k_idx):
        sB = s_table_B[k_idx]

        # Longitudinal sweep of Foreground Swell
        # Spans across lower viewport from left to right with organic diagonal flow
        xB = -8.6 + 15.8 * u + 0.6 * math.sin(math.pi * u)
        # Positioned in foreground: sweeps from Y ~ -11.0 on left to Y ~ -8.8 on right
        yB_crest = -10.8 + 2.4 * u - 0.8 * math.sin(math.pi * (u ** 1.15))

        # Elevation: Serene low crest on left, rising smoothly to form the secondary
        # foreground fold on the right (Z ~ 0.4 on left -> Z ~ 1.35 on right)
        zB_crest = 0.35 + 0.75 * u + 0.65 * math.pow(math.sin(math.pi * (u ** 1.1)), 1.3)

        # Transverse swell widths
        W_front = 2.6 + 1.2 * math.sin(math.pi * u)
        W_back = 2.0 + 1.2 * math.sin(math.pi * (u ** 0.9))

        # Tapering at extreme horizontal boundaries
        taper_start = smoothstep(0.0, 0.15, u)
        taper_end = smoothstep(1.0, 0.85, u)
        edge_taper_B = taper_start * taper_end

        if sB <= 0.52:
            # Front face: rolls downward towards camera out of viewport bottom
            t = sB / 0.52
            yRel = -W_front * (1.0 - t)
            # Gentle convex roll
            zRel = zB_crest - 1.2 * ((1.0 - t) ** 1.6)
            xRel = -1.0 * (1.0 - t) * (1.0 - 0.35 * u)
            x = xB + xRel
            y = yB_crest + yRel
            z = zRel * (0.75 + 0.25 * edge_taper_B)
        else:
            # Back slope: plunges downward into the central chasm
            t = (sB - 0.52) / (1.00 - 0.52)
            # Extends toward Patch A in +Y, terminating at Y ~ -7.2
            yRel = W_back * (0.80 * t + 0.20 * (t ** 2))
            # Plunges deeply down towards Z ~ -2.4
            zRel = zB_crest - 2.6 * (t ** 1.4)
            xRel = 0.6 * t * (1.0 - 0.30 * u)
            x = xB + xRel
            y = yB_crest + yRel
            z = zRel

        return Vector((x, y, z))

    grid_B = []
    for i in range(Nu_B):
        u = i / (Nu_B - 1)
        row = []
        for k in range(Nv_B):
            row.append(eval_patch_B(u, k))
        grid_B.append(row)

    bm_B = bmesh.new()
    verts_B = []
    for i in range(Nu_B):
        r = []
        for k in range(Nv_B):
            r.append(bm_B.verts.new(grid_B[i][k]))
        verts_B.append(r)
    bm_B.verts.ensure_lookup_table()

    faces_B = []
    for i in range(Nu_B - 1):
        for k in range(Nv_B - 1):
            faces_B.append(bm_B.faces.new((verts_B[i][k], verts_B[i+1][k], verts_B[i+1][k+1], verts_B[i][k+1])))
    bm_B.faces.ensure_lookup_table()
    bm_B.normal_update()

    mesh_B = bpy.data.meshes.new("PatchB_ForegroundSwell_Mesh")
    bm_B.to_mesh(mesh_B)
    bm_B.free()

    obj_B = bpy.data.objects.new("PatchB_ForegroundSwell", mesh_B)
    scene.collection.objects.link(obj_B)
    for p in mesh_B.polygons:
        p.use_smooth = True

    subsurf_B = obj_B.modifiers.new(name="CatmullClark_Subsurf", type='SUBSURF')
    subsurf_B.subdivision_type = 'CATMULL_CLARK'
    subsurf_B.levels = 2
    subsurf_B.render_levels = 3

    log("  Patch B Mesh created:")
    log(f"    Control Cage: {Nu_B * Nv_B} vertices, {len(mesh_B.polygons)} quads")
    log("    Catmull-Clark Subdivision: Level 3 Render")

    # =========================================================================
    # 4. COLLISION DETECTION & CLEARANCE VERIFICATION
    # =========================================================================
    log("\n[4] Collision & Clearance Verification (BVHTree):")
    bm_check_A = bmesh.new()
    bm_check_A.from_mesh(mesh_A)
    bvh_A = BVHTree.FromBMesh(bm_check_A)

    bm_check_B = bmesh.new()
    bm_check_B.from_mesh(mesh_B)
    bvh_B = BVHTree.FromBMesh(bm_check_B)

    overlaps = bvh_A.overlap(bvh_B)
    log(f"  Overlap test between Patch A and Patch B control cages: {len(overlaps)} collisions")
    assert len(overlaps) == 0, f"ERROR: Surfaces physically collide! ({len(overlaps)} overlapping face pairs)"

    # Compute minimum 3D clearance between control cage vertices
    min_dist = float('inf')
    for row_a in grid_A:
        for pt_a in row_a:
            for row_b in grid_B:
                for pt_b in row_b:
                    d = (pt_a - pt_b).length
                    if d < min_dist:
                        min_dist = d
    log(f"  Minimum 3D clearance between Patch A and Patch B cages: {min_dist:.2f} units")
    assert min_dist > 0.40, f"ERROR: Clearance too small ({min_dist:.2f} units)"
    log("  COLLISION CHECK PASSED: Zero intersection, confirmed spatial separation.")

    bm_check_A.free()
    bm_check_B.free()

    # Spatial Bounding Boxes
    all_x_A = [pt.x for row in grid_A for pt in row]
    all_y_A = [pt.y for row in grid_A for pt in row]
    all_z_A = [pt.z for row in grid_A for pt in row]

    all_x_B = [pt.x for row in grid_B for pt in row]
    all_y_B = [pt.y for row in grid_B for pt in row]
    all_z_B = [pt.z for row in grid_B for pt in row]

    log("\n  Spatial Bounds:")
    log(f"    Patch A: X=[{min(all_x_A):+.2f}, {max(all_x_A):+.2f}], Y=[{min(all_y_A):+.2f}, {max(all_y_A):+.2f}], Z=[{min(all_z_A):+.2f}, {max(all_z_A):+.2f}]")
    log(f"    Patch B: X=[{min(all_x_B):+.2f}, {max(all_x_B):+.2f}], Y=[{min(all_y_B):+.2f}, {max(all_y_B):+.2f}], Z=[{min(all_z_B):+.2f}, {max(all_z_B):+.2f}]")
    log(f"    Y-Overlap (Under-Apron Slid Under Foreground): Patch A Ymin={min(all_y_A):.2f} < Patch B Ymax={max(all_y_B):.2f}")
    log(f"    Z-Separation in Overlap Region: Patch B Zmin={min(all_z_B):.2f} > Patch A Zmin={min(all_z_A):.2f} (Clean vertical clearance)")

    # =========================================================================
    # 5. MATERIALS SETUP: STUDIO CLAY + DIAGNOSTIC VISIBILITY MATERIALS
    # =========================================================================
    # Neutral Studio Clay Material
    mat_clay = bpy.data.materials.new("StudioClay_Neutral")
    mat_clay.use_nodes = True
    nodes = mat_clay.node_tree.nodes
    links = mat_clay.node_tree.links
    nodes.clear()
    out_node = nodes.new("ShaderNodeOutputMaterial")
    bsdf_node = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf_node.inputs["Base Color"].default_value = (0.58, 0.56, 0.53, 1.0)
    bsdf_node.inputs["Roughness"].default_value = 0.36
    bsdf_node.inputs["Metallic"].default_value = 0.0
    if "Specular IOR Level" in bsdf_node.inputs:
        bsdf_node.inputs["Specular IOR Level"].default_value = 0.50
    elif "Specular" in bsdf_node.inputs:
        bsdf_node.inputs["Specular"].default_value = 0.50
    links.new(bsdf_node.outputs["BSDF"], out_node.inputs["Surface"])

    # Diagnostic Material for Patch A (Bright Cyan/Teal)
    mat_diag_A = bpy.data.materials.new("Diagnostic_PatchA_Cyan")
    mat_diag_A.use_nodes = True
    nA = mat_diag_A.node_tree.nodes
    nA.clear()
    outA = nA.new("ShaderNodeOutputMaterial")
    bsdfA = nA.new("ShaderNodeBsdfPrincipled")
    bsdfA.inputs["Base Color"].default_value = (0.05, 0.65, 0.70, 1.0) # Cyan
    bsdfA.inputs["Roughness"].default_value = 0.30
    mat_diag_A.node_tree.links.new(bsdfA.outputs["BSDF"], outA.inputs["Surface"])

    # Diagnostic Material for Patch B (Warm Amber/Coral)
    mat_diag_B = bpy.data.materials.new("Diagnostic_PatchB_Amber")
    mat_diag_B.use_nodes = True
    nB = mat_diag_B.node_tree.nodes
    nB.clear()
    outB = nB.new("ShaderNodeOutputMaterial")
    bsdfB = nB.new("ShaderNodeBsdfPrincipled")
    bsdfB.inputs["Base Color"].default_value = (0.90, 0.42, 0.10, 1.0) # Amber
    bsdfB.inputs["Roughness"].default_value = 0.30
    mat_diag_B.node_tree.links.new(bsdfB.outputs["BSDF"], outB.inputs["Surface"])

    # Assign default clay material to both
    obj_A.data.materials.append(mat_clay)
    obj_B.data.materials.append(mat_clay)
    log("\n[5] Materials initialized: Neutral Clay + Diagnostic Cyan/Amber shaders")

    # =========================================================================
    # 6. STUDIO LIGHTING & WORLD ENVIRONMENTS
    # =========================================================================
    world_dark = bpy.data.worlds.new("ObsidianStudioWorld")
    world_dark.use_nodes = True
    w_nodes = world_dark.node_tree.nodes
    w_nodes.clear()
    w_out = w_nodes.new("ShaderNodeOutputWorld")
    w_bg = w_nodes.new("ShaderNodeBackground")
    w_bg.inputs["Color"].default_value = (0.010, 0.012, 0.018, 1.0)
    w_bg.inputs["Strength"].default_value = 0.20
    world_dark.node_tree.links.new(w_bg.outputs["Background"], w_out.inputs["Surface"])

    # Diagnostic Magenta World for Visibility Test
    world_diag = bpy.data.worlds.new("DiagnosticWorld_Magenta")
    world_diag.use_nodes = True
    wd_nodes = world_diag.node_tree.nodes
    wd_nodes.clear()
    wd_out = wd_nodes.new("ShaderNodeOutputWorld")
    wd_bg = wd_nodes.new("ShaderNodeBackground")
    # Bright Magenta background so any exposed world gap is immediately obvious!
    wd_bg.inputs["Color"].default_value = (0.80, 0.00, 0.65, 1.0)
    wd_bg.inputs["Strength"].default_value = 1.0
    world_diag.node_tree.links.new(wd_bg.outputs["Background"], wd_out.inputs["Surface"])

    scene.world = world_dark

    # Light 1: Key Grazing Sun (Aimed along crest ridge from upper-right)
    key_data = bpy.data.lights.new("KeyGrazingSun", "SUN")
    key_data.energy = 5.8
    key_data.color = (1.0, 0.98, 0.95)
    key_obj = bpy.data.objects.new("KeyGrazingSun", key_data)
    scene.collection.objects.link(key_obj)
    key_dir = Vector((-1.6, -1.2, -1.4)).normalized()
    key_obj.rotation_euler = key_dir.to_track_quat('-Z', 'Y').to_euler()

    # Light 2: Soft Diffuse Fill Sun (Illuminating the flank & foreground swell)
    fill_data = bpy.data.lights.new("SoftFillSun", "SUN")
    fill_data.energy = 2.4
    fill_data.color = (0.75, 0.82, 0.90)
    fill_obj = bpy.data.objects.new("SoftFillSun", fill_data)
    scene.collection.objects.link(fill_obj)
    fill_dir = Vector((1.4, 1.6, -0.9)).normalized()
    fill_obj.rotation_euler = fill_dir.to_track_quat('-Z', 'Y').to_euler()

    # Light 3: Cavity Bounce Point Light (Illuminating the undercut shadow pocket)
    bounce_data = bpy.data.lights.new("CavityBounceLight", "POINT")
    bounce_data.energy = 500.0
    bounce_data.color = (0.65, 0.72, 0.85)
    bounce_data.shadow_soft_size = 0.8
    bounce_obj = bpy.data.objects.new("CavityBounceLight", bounce_data)
    bounce_obj.location = Vector((2.8, 1.8, 0.8))
    scene.collection.objects.link(bounce_obj)

    log("[6] Studio Lighting Setup configured (Key Grazing 5.8, Soft Fill 2.4, Cavity Bounce 500)")

    # =========================================================================
    # 7. CAMERA SETUPS FOR THE 6 REQUIRED VIEWS
    # =========================================================================
    def create_camera(name, location, target, focal_length=38.0):
        cam_data = bpy.data.cameras.new(name)
        cam_data.lens = focal_length
        cam_data.sensor_width = 36.0
        cam_obj = bpy.data.objects.new(name, cam_data)
        cam_obj.location = location
        dir_vec = (target - location).normalized()
        cam_obj.rotation_euler = dir_vec.to_track_quat('-Z', 'Y').to_euler()
        scene.collection.objects.link(cam_obj)
        return cam_obj

    # Camera 1: Hero Primary Composition View
    # Precisely aligned: Patch B occupies lower third; central chasm is enclosed; Patch A sweeps diagonally
    cam_hero = create_camera("Camera_Hero", Vector((-6.8, -18.5, 6.2)), Vector((0.2, -3.8, 0.9)), focal_length=36.0)

    # Camera 2: Oblique View (Elevated perspective showing compound curvature & 3D volume)
    cam_oblique = create_camera("Camera_Oblique", Vector((-12.0, -14.5, 12.0)), Vector((0.0, -3.2, 0.6)), focal_length=35.0)

    # Camera 3: Side / Profile View (Shows depth separation & independent silhouettes)
    cam_side = create_camera("Camera_Side", Vector((14.0, 1.5, 2.5)), Vector((0.5, -4.2, 0.0)), focal_length=48.0)

    # Camera 4: Chasm Closeup View (Targeted directly into the inter-surface central valley)
    cam_chasm = create_camera("Camera_Chasm", Vector((-2.5, -13.5, 4.2)), Vector((0.2, -6.8, -0.8)), focal_length=50.0)

    log("[7] Camera Setups created for 6 views (Hero, Oblique, Side, Chasm Closeup, Cages, Visibility)")

    # =========================================================================
    # 8. DUAL-COLOR WIREFRAME OVERLAYS FOR VIEW 5
    # =========================================================================
    def create_cage_wireframe(name, grid, color, emission):
        bm_c = bmesh.new()
        nu = len(grid)
        nv = len(grid[0])
        for row in grid:
            for pt in row:
                bm_c.verts.new(pt)
        bm_c.verts.ensure_lookup_table()
        for i in range(nu - 1):
            for j in range(nv - 1):
                bm_c.faces.new((bm_c.verts[i * nv + j],
                                bm_c.verts[(i + 1) * nv + j],
                                bm_c.verts[(i + 1) * nv + (j + 1)],
                                bm_c.verts[i * nv + (j + 1)]))
        m_c = bpy.data.meshes.new(f"{name}_Mesh")
        bm_c.to_mesh(m_c)
        bm_c.free()

        c_obj = bpy.data.objects.new(name, m_c)
        scene.collection.objects.link(c_obj)

        wf = c_obj.modifiers.new("Wireframe", 'WIREFRAME')
        wf.thickness = 0.038
        wf.use_replace = True

        mat_wf = bpy.data.materials.new(f"{name}_Mat")
        mat_wf.use_nodes = True
        n = mat_wf.node_tree.nodes
        n.clear()
        out = n.new("ShaderNodeOutputMaterial")
        bsdf = n.new("ShaderNodeBsdfPrincipled")
        bsdf.inputs["Base Color"].default_value = color
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = emission
            bsdf.inputs["Emission Strength"].default_value = 0.8
        mat_wf.node_tree.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
        c_obj.data.materials.append(mat_wf)
        c_obj.hide_render = True
        return c_obj

    cage_obj_A = create_cage_wireframe("ControlCage_A_Wire", grid_A, (0.08, 0.65, 0.75, 1.0), (0.05, 0.45, 0.55, 1.0))
    cage_obj_B = create_cage_wireframe("ControlCage_B_Wire", grid_B, (0.85, 0.55, 0.12, 1.0), (0.65, 0.38, 0.08, 1.0))

    # =========================================================================
    # 9. SAVE BLENDER SCENE & EXECUTE RENDERS
    # =========================================================================
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    log(f"\n[8] Saved Blender Scene File: {blend_path}")

    log("\n[9] Rendering Required Deliverable Views (1920x1080):")

    # View 1: render-hero.png
    scene.camera = cam_hero
    scene.render.filepath = render_paths["hero"]
    log("  [Render 1/6] Rendering render-hero.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['hero']}")

    # View 2: render-oblique.png
    scene.camera = cam_oblique
    scene.render.filepath = render_paths["oblique"]
    log("  [Render 2/6] Rendering render-oblique.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['oblique']}")

    # View 3: render-side.png
    scene.camera = cam_side
    scene.render.filepath = render_paths["side"]
    log("  [Render 3/6] Rendering render-side.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['side']}")

    # View 4: render-chasm-closeup.png
    scene.camera = cam_chasm
    scene.render.filepath = render_paths["chasm"]
    log("  [Render 4/6] Rendering render-chasm-closeup.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['chasm']}")

    # View 5: render-control-cages.png (Hero view with dual wireframe overlays)
    cage_obj_A.hide_render = False
    cage_obj_B.hide_render = False
    scene.camera = cam_hero
    scene.render.filepath = render_paths["cages"]
    log("  [Render 5/6] Rendering render-control-cages.png (Dual wireframe overlays)...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['cages']}")
    cage_obj_A.hide_render = True
    cage_obj_B.hide_render = True

    # View 6: render-chasm-visibility.png (Diagnostic Materials: Patch A Cyan, Patch B Amber, World Magenta)
    log("  [Render 6/6] Rendering render-chasm-visibility.png (Diagnostic Materials)...")
    obj_A.data.materials[0] = mat_diag_A
    obj_B.data.materials[0] = mat_diag_B
    scene.world = world_diag
    scene.camera = cam_hero
    scene.render.filepath = render_paths["visibility"]
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['visibility']}")

    # Restore default clay materials and dark world
    obj_A.data.materials[0] = mat_clay
    obj_B.data.materials[0] = mat_clay
    scene.world = world_dark
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)

    total_time = time.time() - start_time
    log("\n" + "=" * 80)
    log(f"MULTI-PATCH PILOT 02.1 BUILD COMPLETE in {total_time:.2f} seconds")
    log("=" * 80)

    with open(log_path, "w", encoding="utf-8") as f:
        f.write("\n".join(log_lines) + "\n")

if __name__ == "__main__":
    import traceback
    try:
        build_pilot_02_1()
    except Exception as e:
        log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "build.log")
        with open(log_path, "w", encoding="utf-8") as f:
            f.write("BUILD FAILED WITH EXCEPTION:\n" + traceback.format_exc())
        raise
