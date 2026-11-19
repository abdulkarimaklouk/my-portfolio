"""
Multi-Patch Pilot 02 — Two-Surface Overlap Validation (build_pilot.py)
----------------------------------------------------------------------
Role: Senior 3D Technical Artist & Geometry Engineer
Architecture: Candidate D — Hybrid Multi-Patch Architecture
              (Independent Bivariate 3D Quad Control Cages -> Catmull-Clark Subdivision)

Objective:
  Construct and validate TWO independent, non-intersecting 3D surface patches:
    - Patch A (Primary Structure): Preserves and refines the validated Pilot 01 crest,
      applying apex crease weighting (e=0.5) and boundary tapering.
    - Patch B (Foreground Swell): Independently authored 3D bivariate quad cage
      forming a broad, undulating foreground swell positioned closer to camera.
    - Central Chasm: Validates that inter-surface spatial depth separation and mutual
      occlusion produce a natural dark negative space void without physical intersection.

Deliverables:
  - pilot-02.blend: Editable Blender scene with both independent patches
  - render-hero.png: Primary composition view (diagonal crest + foreground swell + chasm)
  - render-oblique.png: Elevated 3/4 perspective showing compound curvature & depth
  - render-side.png: Profile view showing depth separation & independent silhouettes
  - render-chasm-closeup.png: Closeup inspection into the inter-surface central chasm
  - render-control-cages.png: Control cage inspection view with dual-color wireframe overlays

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

def build_pilot_02():
    start_time = time.time()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    blend_path = os.path.join(script_dir, "pilot-02.blend")
    log_path = os.path.join(script_dir, "build.log")

    render_paths = {
        "hero": os.path.join(script_dir, "render-hero.png"),
        "oblique": os.path.join(script_dir, "render-oblique.png"),
        "side": os.path.join(script_dir, "render-side.png"),
        "chasm": os.path.join(script_dir, "render-chasm-closeup.png"),
        "cages": os.path.join(script_dir, "render-control-cages.png"),
    }

    log_lines = []
    def log(msg):
        print(msg)
        log_lines.append(str(msg))

    log("=" * 80)
    log("MULTI-PATCH PILOT 02 — TWO-SURFACE OVERLAP VALIDATION BUILD")
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
    # 2. PATCH A: PRIMARY SCULPTURAL WAVE (STRUCTURE B)
    # =========================================================================
    # Grid: Nu_A = 14 rows (longitudinal) x Nv_A = 11 columns (transverse)
    Nu_A = 14
    Nv_A = 11
    s_table_A = [0.00, 0.10, 0.22, 0.36, 0.50, 0.63, 0.74, 0.81, 0.86, 0.93, 1.00]

    log(f"\n[2] Generating Patch A (Primary Crest) Control Cage ({Nu_A} x {Nv_A} = {Nu_A * Nv_A} vertices)...")

    def eval_patch_A(u, j_idx):
        s = s_table_A[j_idx]

        # Longitudinal Backbone (diagonal sweep from lower-left to upper-right)
        xCrest = -7.2 + 14.2 * u + 0.8 * math.sin(math.pi * u)
        yCrest = -1.8 + 4.6 * u - 1.6 * math.sin(math.pi * (u ** 1.1))
        # Elevation profile: rises from 0.4 to a strong focal crest peak at u=0.68 (Z=3.85), then tapers
        zCrest = 0.4 + 3.45 * math.pow(math.sin(math.pi * (u ** 0.75)), 1.3)

        # Dynamic banking angle: crest tilts forward towards camera by up to 24 deg
        bank_angle = math.radians(10.0 + 16.0 * math.sin(math.pi * (u ** 0.85)))

        # Longitudinal Modulation Metrics
        W_apron = 3.5 + 2.8 * math.sin(math.pi * (u ** 0.80)) - 1.2 * (u ** 2)
        D_basin = 1.6 + 2.2 * math.sin(math.pi * (u ** 0.80))
        R_curl = 0.60 + 0.85 * math.sin(math.pi * (u ** 0.85))
        Theta_max = math.radians(140.0 + 38.0 * math.sin(math.pi * (u ** 0.85)))

        # Smooth boundary tapering to avoid dog-ear pinching
        taper_start = math.sin(clamp(u / 0.15, 0.0, 1.0) * math.pi * 0.5)
        taper_end = math.sin(clamp((1.0 - u) / 0.18, 0.0, 1.0) * math.pi * 0.5)
        edge_taper = taper_start * taper_end

        if s <= 0.36:
            # Zone 1: Apron Basin & Valley Trough (s in [0, 0.36])
            # Plunges deeply into the central chasm
            t = s / 0.36
            yRel = -W_apron * (1.0 - 0.65 * t)
            trough_profile = math.cos(math.pi * t)
            saddle_scoop = -1.2 * math.sin(math.pi * u) * math.sin(math.pi * t)
            zRel = -D_basin * (0.50 + 0.50 * trough_profile) + saddle_scoop
            xRel = -2.8 * (1.0 - t) * (1.0 - 0.30 * u)
            x = xCrest + xRel
            y = yCrest + yRel
            z = zRel * edge_taper

        elif s <= 0.86:
            # Zone 2: Ascending Flank & Crest Shoulder (s in [0.36, 0.86])
            t = (s - 0.36) / (0.86 - 0.36)
            S = 3.0 * (t ** 2) - 2.0 * (t ** 3)
            yBase = -W_apron * 0.35
            zBase = -D_basin * 0.12 - 1.2 * math.sin(math.pi * u)
            xBase = -0.6 * (1.0 - 0.30 * u)

            # Secondary flank tension wave to eliminate monolithic sail appearance
            flank_wave = 0.45 * math.sin(2.0 * math.pi * u) * math.sin(math.pi * t)
            mid_bulge = 0.80 * math.sin(math.pi * t) * math.sin(math.pi * (u ** 0.9))

            yRel = yBase * (1.0 - S) - math.sin(bank_angle) * S * 0.8
            zRel = (zBase * (1.0 - S) + zCrest * S) - mid_bulge + flank_wave
            xRel = xBase * (1.0 - t)
            x = xCrest + xRel
            y = yCrest + yRel
            z = zRel

        else:
            # Zone 3: Overhanging Lip & Tucked Shadow Pocket (s in [0.86, 1.00])
            t = (s - 0.86) / (1.00 - 0.86)
            angle = t * Theta_max
            rawDY = R_curl * math.sin(angle)
            rawDZ = -R_curl * (1.0 - math.cos(angle))

            # Proportional curl scaling at extremities to prevent self-intersection
            curl_scale = 0.40 + 0.60 * edge_taper
            dy_rot = (rawDY * math.cos(bank_angle) - rawDZ * math.sin(bank_angle)) * curl_scale
            dz_rot = (rawDY * math.sin(bank_angle) + rawDZ * math.cos(bank_angle)) * curl_scale
            dx_rot = 0.30 * R_curl * math.sin(angle) * curl_scale

            x = xCrest + dx_rot
            y = yCrest + dy_rot
            z = zCrest + dz_rot

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

    # Crease weighting on crest apex (j=8)
    crease_layer_A = bm_A.edges.layers.float.get("crease_edge") or bm_A.edges.layers.float.new("crease_edge")
    bm_A.edges.ensure_lookup_table()
    for i in range(Nu_A - 1):
        v1 = verts_A[i][8]
        v2 = verts_A[i+1][8]
        edge = bm_A.edges.get((v1, v2))
        if edge:
            edge[crease_layer_A] = 0.50

    bm_A.normal_update()

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
    log("    Applied: Apex Crease Weight = 0.50 (edge loop j=8)")
    log("    Applied: Catmull-Clark Level 3 Render Subdivision")

    # =========================================================================
    # 3. PATCH B: FOREGROUND SWELL (STRUCTURE C)
    # =========================================================================
    # Grid: Nu_B = 12 rows (longitudinal) x Nv_B = 9 columns (transverse)
    # Positioned in foreground: Y in [-10.5, -5.5], Z in [-2.0, +1.8]
    Nu_B = 12
    Nv_B = 9

    log(f"\n[3] Generating Patch B (Foreground Swell) Control Cage ({Nu_B} x {Nv_B} = {Nu_B * Nv_B} vertices)...")

    def eval_patch_B(u, k_idx):
        # Transverse distribution sB in [0, 1]
        # k=0..2: Front lip (slopes down towards camera / out of frame)
        # k=3..5: Broad convex foreground swell crest
        # k=6..8: Back slope (plunges down into the central chasm void)
        sB_table = [0.00, 0.12, 0.28, 0.44, 0.56, 0.68, 0.80, 0.90, 1.00]
        sB = sB_table[k_idx]

        # Longitudinal sweep of Foreground Swell
        # Spans across lower viewport from left to right
        xB = -8.8 + 15.6 * u + 0.5 * math.sin(math.pi * u)
        # Positioned in foreground (Y_B ~ -11.2 to -9.0)
        yB_crest = -11.2 + 2.2 * u - 0.6 * math.sin(math.pi * (u ** 1.2))

        # Elevation: Broad gentle swell spanning lower third of viewport, rising on right flank
        zB_crest = 0.4 + 0.6 * u + 0.7 * math.pow(math.sin(math.pi * (u ** 1.1)), 1.4)

        # Transverse swell width: expands gently in midground
        W_front = 2.4 + 0.8 * math.sin(math.pi * u)
        W_back = 1.6 + 0.8 * math.sin(math.pi * (u ** 0.9))

        # Tapering at extreme horizontal edges
        taper_B = math.sin(clamp(u / 0.14, 0.0, 1.0) * math.pi * 0.5) * math.sin(clamp((1.0 - u) / 0.14, 0.0, 1.0) * math.pi * 0.5)

        if sB <= 0.50:
            # Front face: rolls downward towards camera
            t = sB / 0.50
            yRel = -W_front * (1.0 - t)
            # Gentle roll downward towards the camera edge
            zRel = zB_crest - 1.0 * ((1.0 - t) ** 1.5)
            xRel = -0.8 * (1.0 - t) * (1.0 - 0.4 * u)
            x = xB + xRel
            y = yB_crest + yRel
            z = zRel * (0.7 + 0.3 * taper_B)
        else:
            # Back slope: plunges downward and backward into the central chasm
            t = (sB - 0.50) / 0.50
            yRel = W_back * (0.85 * t + 0.15 * (t ** 2))
            # Plunges down into the chasm abyss
            zRel = zB_crest - 2.4 * (t ** 1.4)
            xRel = 0.5 * t * (1.0 - 0.3 * u)
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
    log("    Applied: Catmull-Clark Level 3 Render Subdivision")

    # =========================================================================
    # 4. COLLISION DETECTION & CLEARANCE VERIFICATION
    # =========================================================================
    log("\n[4] Collision & Clearance Verification (BVHTree):")
    # Verify both control cages do not intersect
    bm_check_A = bmesh.new()
    bm_check_A.from_mesh(mesh_A)
    bvh_A = BVHTree.FromBMesh(bm_check_A)

    bm_check_B = bmesh.new()
    bm_check_B.from_mesh(mesh_B)
    bvh_B = BVHTree.FromBMesh(bm_check_B)

    overlaps = bvh_A.overlap(bvh_B)
    log(f"  Overlap test between Patch A and Patch B cages: {len(overlaps)} collisions")
    assert len(overlaps) == 0, f"ERROR: Surfaces physically collide! ({len(overlaps)} overlapping face pairs)"

    # Compute minimum clearance between vertices of Patch A and Patch B
    min_dist = float('inf')
    for row_a in grid_A:
        for pt_a in row_a:
            for row_b in grid_B:
                for pt_b in row_b:
                    d = (pt_a - pt_b).length
                    if d < min_dist:
                        min_dist = d
    log(f"  Minimum 3D clearance between Patch A and Patch B control cages: {min_dist:.2f} units")
    assert min_dist > 0.40, f"ERROR: Surfaces are dangerously close ({min_dist:.2f} units)"
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
    log(f"    Depth Gap (Y-axis separation between Patch B crest and Patch A crest): ~{abs(min(all_y_A) - min(all_y_B)):.2f} units")

    # =========================================================================
    # 5. NEUTRAL STUDIO CLAY MATERIAL
    # =========================================================================
    mat_clay = bpy.data.materials.new("StudioClay_MultiPatch")
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

    obj_A.data.materials.append(mat_clay)
    obj_B.data.materials.append(mat_clay)
    log("\n[5] Material: Studio Clay applied to both Patch A and Patch B")

    # =========================================================================
    # 6. STUDIO LIGHTING & WORLD ENVIRONMENT
    # =========================================================================
    world = bpy.data.worlds.new("ObsidianStudioWorld")
    world.use_nodes = True
    w_nodes = world.node_tree.nodes
    w_nodes.clear()
    w_out = w_nodes.new("ShaderNodeOutputWorld")
    w_bg = w_nodes.new("ShaderNodeBackground")
    w_bg.inputs["Color"].default_value = (0.010, 0.012, 0.018, 1.0)
    w_bg.inputs["Strength"].default_value = 0.20
    world.node_tree.links.new(w_bg.outputs["Background"], w_out.inputs["Surface"])
    scene.world = world

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
    # 7. CAMERA SETUPS FOR THE 5 REQUIRED DELIVERABLE VIEWS
    # =========================================================================
    def create_camera(name, location, target, focal_length=42.0):
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
    # Perfectly frames Patch B in foreground, Patch A in midground, and the dark chasm between
    cam_hero = create_camera("Camera_Hero", Vector((-7.0, -19.5, 6.8)), Vector((0.2, -4.0, 1.2)), focal_length=35.0)

    # Camera 2: Oblique View (Elevated perspective showing compound curvature & 3D volume)
    cam_oblique = create_camera("Camera_Oblique", Vector((-12.5, -15.0, 12.5)), Vector((0.0, -3.5, 0.6)), focal_length=35.0)

    # Camera 3: Side / Profile View (Shows depth separation & independent silhouettes)
    cam_side = create_camera("Camera_Side", Vector((14.0, 1.8, 2.8)), Vector((0.5, -4.0, 0.2)), focal_length=48.0)

    # Camera 4: Chasm Closeup View (Targeted directly into the inter-surface central valley)
    cam_chasm = create_camera("Camera_Chasm", Vector((-2.5, -14.0, 4.5)), Vector((0.0, -7.5, -0.2)), focal_length=50.0)

    log("[7] Camera Setups created for 5 views (Hero, Oblique, Side, Chasm Closeup, Cages)")

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
        wf.thickness = 0.040
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

    # Patch A cage: Cyan-Slate wireframe
    cage_obj_A = create_cage_wireframe("ControlCage_A_Wire", grid_A, (0.08, 0.65, 0.75, 1.0), (0.05, 0.45, 0.55, 1.0))
    # Patch B cage: Amber-Gold wireframe
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
    log("  [Render 1/5] Rendering render-hero.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['hero']}")

    # View 2: render-oblique.png
    scene.camera = cam_oblique
    scene.render.filepath = render_paths["oblique"]
    log("  [Render 2/5] Rendering render-oblique.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['oblique']}")

    # View 3: render-side.png
    scene.camera = cam_side
    scene.render.filepath = render_paths["side"]
    log("  [Render 3/5] Rendering render-side.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['side']}")

    # View 4: render-chasm-closeup.png
    scene.camera = cam_chasm
    scene.render.filepath = render_paths["chasm"]
    log("  [Render 4/5] Rendering render-chasm-closeup.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['chasm']}")

    # View 5: render-control-cages.png (Oblique view with dual wireframe overlays)
    cage_obj_A.hide_render = False
    cage_obj_B.hide_render = False
    scene.camera = cam_oblique
    scene.render.filepath = render_paths["cages"]
    log("  [Render 5/5] Rendering render-control-cages.png (Dual wireframe overlays)...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['cages']}")

    # Re-hide wireframes and save final blend state
    cage_obj_A.hide_render = True
    cage_obj_B.hide_render = True
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)

    total_time = time.time() - start_time
    log("\n" + "=" * 80)
    log(f"MULTI-PATCH PILOT 02 BUILD COMPLETE in {total_time:.2f} seconds")
    log("=" * 80)

    with open(log_path, "w", encoding="utf-8") as f:
        f.write("\n".join(log_lines) + "\n")

if __name__ == "__main__":
    import traceback
    try:
        build_pilot_02()
    except Exception as e:
        log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "build.log")
        with open(log_path, "w", encoding="utf-8") as f:
            f.write("BUILD FAILED WITH EXCEPTION:\n" + traceback.format_exc())
        raise
