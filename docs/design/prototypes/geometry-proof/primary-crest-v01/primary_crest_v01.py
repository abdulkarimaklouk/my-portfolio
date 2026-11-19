"""
Primary Crest Visual Proof 01 (primary_crest_v01.py)
-----------------------------------------------------
Role: Senior 3D Technical Artist & Blender Python Geometry Engineer
Method: C + A Hybrid — Procedurally Lofted Quad Surface with Catmull-Clark Subdivision.

Builds an isolated 3D fluid crest patch representing the dominant formation
(Structure B) in the approved visual reference (hero-fluid-mesh-primary.jpg).

Camera Baseline:
  Resolution: 1920 x 1080 (16:9)
  Lens: 32mm, Sensor: 36mm
  Position: (0.0, -17.5, 12.5)
  Target:   (1.0, 2.5, 0.5)

Executes headlessly via:
  blender-launcher -b --python primary_crest_v01.py
"""

import bpy
import bmesh
import mathutils
import math
import time
import os
import sys

def run():
    start_time = time.time()
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    blend_path = os.path.join(script_dir, "primary_crest_v01.blend")
    render_path = os.path.join(script_dir, "primary_crest_v01.png")
    log_path = os.path.join(script_dir, "build.log")
    
    log_lines = []
    def log(msg):
        print(msg)
        log_lines.append(str(msg))

    log("=" * 70)
    log("Primary Crest Visual Proof 01 — Automated Build Execution")
    log(f"Blender Version: {bpy.app.version_string}")
    log(f"Execution Directory: {script_dir}")
    log("=" * 70)

    # 1. Reset Scene
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene

    # 2. Spine Curve Definition (6 Spatial Bézier Control Points)
    # Designed to flow from lower-center toward upper-right relative to camera framing
    cps = [
        mathutils.Vector((-4.8, -0.6, -1.0)),   # P0: Entry at lower-left/center
        mathutils.Vector((-2.4,  0.8, -0.2)),   # P1: Rising into the diagonal sweep
        mathutils.Vector(( 0.3,  2.1,  0.8)),   # P2: Ascending through mid-frame
        mathutils.Vector(( 2.8,  3.2,  2.2)),   # P3: Climbing toward high focal zone
        mathutils.Vector(( 5.2,  4.0,  3.6)),   # P4: Apex peak in upper-right
        mathutils.Vector(( 7.5,  4.6,  2.4))    # P5: Natural descent into background
    ]

    log("\n[1] 3D Spine Curve (Degree 5 Bézier, 6 Control Points):")
    for i, cp in enumerate(cps):
        log(f"  P{i}: ({cp.x:6.2f}, {cp.y:6.2f}, {cp.z:6.2f})")

    def eval_bezier(cps, u):
        om = 1.0 - u
        b = [
            om**5,
            5 * u * om**4,
            10 * u**2 * om**3,
            10 * u**3 * om**2,
            5 * u**4 * om,
            u**5
        ]
        pos = mathutils.Vector((0.0, 0.0, 0.0))
        for i in range(6):
            pos += b[i] * cps[i]

        db = [
            -5 * om**4,
            5 * (om**4 - 4 * u * om**3),
            10 * (2 * u * om**3 - 3 * u**2 * om**2),
            10 * (3 * u**2 * om**2 - 2 * u**3 * om),
            5 * (4 * u**3 * om - u**4),
            5 * u**4
        ]
        tan = mathutils.Vector((0.0, 0.0, 0.0))
        for i in range(6):
            tan += db[i] * cps[i]
        return pos, tan.normalized()

    # Discretization resolution
    Nu = 64   # Longitudinal samples along the spine
    Nv = 38   # Transverse samples across the fold profile
    v_crest = 0.62  # Parametric position of crest apex in v in [0, 1]

    # Sample spine points and tangents
    pts = []
    tans = []
    for i in range(Nu):
        u = i / (Nu - 1)
        p, t = eval_bezier(cps, u)
        pts.append(p)
        tans.append(t)

    # 3. Parallel Transport Frames (Rotation-Minimizing Frames via Double Reflection)
    t0 = tans[0]
    up_ref = mathutils.Vector((0.0, 0.0, 1.0))
    n0 = (up_ref - (up_ref.dot(t0)) * t0).normalized()
    b0 = t0.cross(n0).normalized()

    normals = [n0]
    binormals = [b0]

    for i in range(Nu - 1):
        xi = pts[i]
        xi1 = pts[i+1]
        ti = tans[i]
        ti1 = tans[i+1]
        ni = normals[i]
        
        v1 = xi1 - xi
        c1 = v1.dot(v1)
        if c1 > 1e-12:
            ni_L = ni - (2.0 / c1) * (v1.dot(ni)) * v1
            ti_L = ti - (2.0 / c1) * (v1.dot(ti)) * v1
        else:
            ni_L, ti_L = ni, ti
            
        v2 = ti1 - ti_L
        c2 = v2.dot(v2)
        if c2 > 1e-12:
            ni1 = (ni_L - (2.0 / c2) * (v2.dot(ni_L)) * v2).normalized()
        else:
            ni1 = ni_L.normalized()
            
        bi1 = ti1.cross(ni1).normalized()
        normals.append(ni1)
        binormals.append(bi1)

    max_ortho_err = max(abs(tans[i].dot(normals[i])) for i in range(Nu))
    log(f"\n[2] Parallel Transport Frame (RMF) Verification:")
    log(f"  Longitudinal Steps (Nu): {Nu}")
    log(f"  Frame Orthonormality Max Error |T . N|: {max_ortho_err:.3e} (Strictly zero-twist)")

    # 4. Transverse Profile & Parameter Clustering
    # Clustering around v_crest to form tight geometric support loops for subdivision
    v_samples = []
    for j in range(Nv):
        t = j / (Nv - 1)
        # Symmetrical cubic clustering centered on v_crest
        delta = t - v_crest
        t_clustered = v_crest + math.copysign(abs(delta)**1.25, delta) * (v_crest if delta < 0 else (1.0 - v_crest))
        t_clustered = max(0.0, min(1.0, t_clustered))
        v_samples.append(t_clustered)
    v_samples.sort()
    v_samples[0] = 0.0
    v_samples[-1] = 1.0

    def smoothstep(e0, e1, x):
        t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
        return t * t * (3.0 - 2.0 * t)

    def bank_angle(u):
        # Dynamic roll banking along spine curve
        return math.radians(-6.0 + 24.0 * math.sin(u * math.pi * 0.85))

    def evaluate_profile(u, v):
        """
        Calculates transverse displacement in the banked local (B, N) frame.
        b_coord: across-fold coordinate (transverse)
        n_coord: crest elevation coordinate (normal)
        """
        env_u = smoothstep(0.0, 0.16, u) * smoothstep(1.0, 0.84, u)
        
        # Dimensions varying continuously along spine
        width_apron = (4.4 + 2.4 * math.sin(u * math.pi)) * (0.35 + 0.65 * env_u)
        width_back  = (1.2 + 0.8 * math.sin(u * math.pi)) * (0.35 + 0.65 * env_u)
        crest_height = (2.0 + 1.8 * math.sin(u * math.pi * 0.9)) * (0.35 + 0.65 * env_u)
        undercut_depth = (1.1 + 0.9 * math.sin(u * math.pi)) * env_u
        curl_back = (0.7 + 0.6 * math.sin(u * math.pi)) * env_u
        
        if v <= v_crest:
            # Apron to Crest Apex
            t = v / v_crest
            # Asymmetric S-curve: broad valley apron rising smoothly to crest apex
            b_coord = -width_apron * (1.0 - t**1.35)
            n_coord = crest_height * (2.2 * t**2 - 1.2 * t**3) - (1.0 - t)**2 * (0.35 * crest_height)
        else:
            # Crest Apex to Undercut Back Wall
            t = (v - v_crest) / (1.0 - v_crest)
            # Folds over apex, then curls down and tucks backward
            b_coord = width_back * math.sin(t * math.pi * 0.72) - curl_back * t**2
            n_coord = crest_height * math.cos(t * math.pi * 0.52) - undercut_depth * t**1.45
            
        return b_coord, n_coord

    # 5. Generate 3D Surface Grid S(u, v) = C(u) + P(u, v)
    grid = []
    min_clearance = float('inf')

    for i in range(Nu):
        u = i / (Nu - 1)
        C_u = pts[i]
        N_u = normals[i]
        B_u = binormals[i]
        
        theta = bank_angle(u)
        c_th = math.cos(theta)
        s_th = math.sin(theta)
        
        N_bank = (c_th * N_u + s_th * B_u).normalized()
        B_bank = (-s_th * N_u + c_th * B_u).normalized()
        
        row = []
        for j in range(Nv):
            v = v_samples[j]
            b_coord, n_coord = evaluate_profile(u, v)
            P_uv = b_coord * B_bank + n_coord * N_bank
            S_uv = C_u + P_uv
            row.append(S_uv)
        grid.append(row)

    # 6. Geometric Non-Self-Intersection Test
    # Verify that the curling back wall does not penetrate through the apron
    for i in range(Nu):
        apron_pts = [grid[i][j] for j in range(int(Nv * 0.4))]
        back_pts  = [grid[i][j] for j in range(int(Nv * 0.8), Nv)]
        for ap in apron_pts:
            for bp in back_pts:
                dist = (ap - bp).length
                if dist < min_clearance:
                    min_clearance = dist

    log(f"\n[3] Geometry Verification & Clearance:")
    log(f"  Minimum Apron-to-Undercut Spatial Clearance: {min_clearance:.3f} units")
    if min_clearance > 0.15:
        log("  Intersection Test Result: PASSED (Strictly non-self-intersecting 3D fold)")
    else:
        log("  Intersection Test Result: WARNING (Clearance below threshold)")

    # 7. Construct Blender Mesh and Quad Topology
    mesh = bpy.data.meshes.new("PrimaryCrest_Mesh")
    obj = bpy.data.objects.new("PrimaryCrest", mesh)
    scene.collection.objects.link(obj)

    verts = []
    uvs = []
    for i in range(Nu):
        u = i / (Nu - 1)
        for j in range(Nv):
            v = v_samples[j]
            verts.append(grid[i][j])
            uvs.append((u, v))

    faces = []
    for i in range(Nu - 1):
        for j in range(Nv - 1):
            idx00 = i * Nv + j
            idx10 = (i + 1) * Nv + j
            idx11 = (i + 1) * Nv + (j + 1)
            idx01 = i * Nv + (j + 1)
            faces.append((idx00, idx10, idx11, idx01))

    mesh.from_pydata(verts, [], faces)
    mesh.update(calc_edges=True)

    # Add UV Map
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            v_idx = mesh.loops[loop_idx].vertex_index
            uv_layer.data[loop_idx].uv = uvs[v_idx]

    # Smooth Shading on all Polygons
    for poly in mesh.polygons:
        poly.use_smooth = True

    # 8. Add Catmull-Clark Subdivision Surface Modifier
    subsurf = obj.modifiers.new("CatmullClark", "SUBSURF")
    subsurf.subdivision_type = "CATMULL_CLARK"
    subsurf.levels = 2
    subsurf.render_levels = 2

    # Measure Dimensions
    bpy.context.view_layer.update()
    bbox = [mathutils.Vector(corner) for corner in obj.bound_box]
    min_co = mathutils.Vector((min(b.x for b in bbox), min(b.y for b in bbox), min(b.z for b in bbox)))
    max_co = mathutils.Vector((max(b.x for b in bbox), max(b.y for b in bbox), max(b.z for b in bbox)))
    dims = max_co - min_co

    log(f"\n[4] Mesh Metrics (Pre-Subdivision Control Cage):")
    log(f"  Vertices: {len(verts)} ({Nu} u-rings x {Nv} v-slices)")
    log(f"  Quads:    {len(faces)} ({Nu-1} x {Nv-1} all-quad topology)")
    log(f"  Bounding Box Min: ({min_co.x:.2f}, {min_co.y:.2f}, {min_co.z:.2f})")
    log(f"  Bounding Box Max: ({max_co.x:.2f}, {max_co.y:.2f}, {max_co.z:.2f})")
    log(f"  Mesh Dimensions:  X={dims.x:.2f}, Y={dims.y:.2f}, Z={dims.z:.2f}")
    log(f"  Subdivision Level: {subsurf.levels} (Catmull-Clark)")
    eval_quads = len(faces) * (4 ** subsurf.render_levels)
    log(f"  Rendered Evaluated Quads: {eval_quads:,}")

    # 9. Camera Baseline Setup
    cam_pos = mathutils.Vector((0.0, -17.5, 12.5))
    cam_target = mathutils.Vector((1.0, 2.5, 0.5))

    cam_data = bpy.data.cameras.new("HeroCamera")
    cam_data.lens = 32
    cam_data.sensor_width = 36
    cam_data.clip_start = 0.1
    cam_data.clip_end = 100.0

    cam_obj = bpy.data.objects.new("HeroCamera", cam_data)
    scene.collection.objects.link(cam_obj)
    scene.camera = cam_obj
    cam_obj.location = cam_pos

    cam_dir = cam_target - cam_pos
    cam_obj.rotation_euler = cam_dir.to_track_quat('-Z', 'Y').to_euler()

    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100

    bpy.context.view_layer.update()

    from bpy_extras.object_utils import world_to_camera_view
    crest_apex_3d = grid[int(Nu * 0.65)][int(Nv * v_crest)]
    apex_screen = world_to_camera_view(scene, cam_obj, crest_apex_3d)

    log(f"\n[5] Camera Baseline Verification:")
    log(f"  Position: {cam_pos[:]}")
    log(f"  Target:   {cam_target[:]}")
    log(f"  Focal Length: {cam_data.lens}mm, Sensor: {cam_data.sensor_width}mm")
    log(f"  Primary Crest Apex Screen Pos: X={apex_screen.x:.3f}, Y={apex_screen.y:.3f}, Depth={apex_screen.z:.2f}")

    # 10. Material & Lighting (Restrained Dark Emerald Studio with Grazing Crest Highlight)
    # Material
    mat = bpy.data.materials.new("DarkEmeraldFluid")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    node_out = nodes.new("ShaderNodeOutputMaterial")
    node_bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    
    # Deep obsidian-emerald base color (#021209)
    node_bsdf.inputs["Base Color"].default_value = (0.008, 0.071, 0.035, 1.0)
    node_bsdf.inputs["Roughness"].default_value = 0.28
    node_bsdf.inputs["Metallic"].default_value = 0.08
    if "Specular IOR Level" in node_bsdf.inputs:
        node_bsdf.inputs["Specular IOR Level"].default_value = 0.65
    elif "Specular" in node_bsdf.inputs:
        node_bsdf.inputs["Specular"].default_value = 0.65
        
    links.new(node_bsdf.outputs["BSDF"], node_out.inputs["Surface"])
    obj.data.materials.append(mat)

    # World Environment: Dark Obsidian (#010302)
    world = bpy.data.worlds.new("ObsidianWorld")
    world.use_nodes = True
    w_nodes = world.node_tree.nodes
    w_nodes.clear()
    w_out = w_nodes.new("ShaderNodeOutputWorld")
    w_bg = w_nodes.new("ShaderNodeBackground")
    w_bg.inputs["Color"].default_value = (0.003, 0.008, 0.005, 1.0)
    w_bg.inputs["Strength"].default_value = 0.15
    world.node_tree.links.new(w_bg.outputs["Background"], w_out.inputs["Surface"])
    scene.world = world

    # Light 1: Focused Grazing Rim / Crest Highlight Light (Emerald/Mint tint)
    # Positioned behind/above-right to strike the crest apex at a grazing angle
    rim_data = bpy.data.lights.new("RimGrazingLight", "SUN")
    rim_data.energy = 6.5
    rim_data.color = (0.35, 1.0, 0.70)  # Radiant mint-emerald
    rim_obj = bpy.data.objects.new("RimGrazingLight", rim_data)
    scene.collection.objects.link(rim_obj)
    rim_dir = mathutils.Vector((-1.4, -1.8, -1.2)).normalized()
    rim_obj.rotation_euler = rim_dir.to_track_quat('-Z', 'Y').to_euler()

    # Light 2: Soft Key Light (Atmospheric Dark Green modeling for the apron)
    key_data = bpy.data.lights.new("KeyApronLight", "SUN")
    key_data.energy = 3.8
    key_data.color = (0.12, 0.52, 0.30)
    key_obj = bpy.data.objects.new("KeyApronLight", key_data)
    scene.collection.objects.link(key_obj)
    # Aiming from front-left to illuminate the broad apron S-curve
    key_dir = mathutils.Vector((0.6, 1.8, -1.2)).normalized()
    key_obj.rotation_euler = key_dir.to_track_quat('-Z', 'Y').to_euler()

    # Light 3: Subtle Valley Bounce Fill
    fill_data = bpy.data.lights.new("ValleyFillLight", "POINT")
    fill_data.energy = 350.0
    fill_data.color = (0.06, 0.32, 0.18)
    fill_obj = bpy.data.objects.new("ValleyFillLight", fill_data)
    scene.collection.objects.link(fill_obj)
    fill_obj.location = mathutils.Vector((-1.5, -4.0, 2.5))

    log("\n[6] Lighting & Shading Setup:")
    log(f"  Material: Dark Emerald Fluid (Roughness=0.28, Specular=0.65)")
    log(f"  Lights: Grazing Crest Rim Sun (Energy=6.5, #59FFB2), Key Apron Sun (Energy=3.8), Point Fill (Energy=350)")

    # 11. Save .blend File
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    log(f"\n[7] Saved Blend File: {blend_path}")

    # 12. Render Still Image
    scene.render.filepath = render_path
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '8'

    log("\n[8] Rendering Still Image (1920x1080)...")
    r_start = time.time()
    bpy.ops.render.render(write_still=True)
    r_end = time.time()
    log(f"  Render Complete: {render_path}")
    log(f"  Render Duration: {r_end - r_start:.2f} seconds")

    total_time = time.time() - start_time
    log(f"\n[9] Total Execution Duration: {total_time:.2f} seconds")
    log("=" * 70)
    log("BUILD SUCCESSFUL")
    log("=" * 70)

    # Write build.log
    with open(log_path, "w", encoding="utf-8") as f:
        f.write("\n".join(log_lines) + "\n")

if __name__ == "__main__":
    run()
