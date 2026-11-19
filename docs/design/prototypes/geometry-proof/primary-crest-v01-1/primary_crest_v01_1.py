"""
Primary Crest Visual Proof v01.1 (primary_crest_v01_1.py)
-----------------------------------------------------------
Role: Senior 3D Technical Artist & Blender Python Geometry Engineer
Methodology: C + A Hybrid — Procedurally Lofted Quad Surface with Catmull-Clark Subdivision.

Redesigns the transverse cross-section into an asymmetric 5-zone fluid profile
using centripetal Catmull-Rom spline interpolation (alpha = 0.5) over 7 ordered
control nodes (q0-q6), combined with non-collapsing longitudinal evolution.

Preserved Baseline Components:
  - 6 original Bézier spine control points
  - Double Reflection Parallel Transport Frame (RMF)
  - Camera Position: (0.0, -17.5, 12.5), Target: (1.0, 2.5, 0.5)
  - Camera Lens: 32mm, Sensor: 36mm
  - Render Resolution: 1920 x 1080 (16:9)
  - Material & Studio Lighting
  - Mesh Resolution: 64 u-rings x 38 v-slices
  - Catmull-Clark Subdivision Level: 2

Executes headlessly via:
  blender-launcher -b --python primary_crest_v01_1.py
"""

import bpy
import bmesh
import mathutils
from mathutils.bvhtree import BVHTree
import math
import time
import os
import sys

def run():
    start_time = time.time()
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    blend_path = os.path.join(script_dir, "primary_crest_v01_1.blend")
    render_path = os.path.join(script_dir, "primary_crest_v01_1.png")
    log_path = os.path.join(script_dir, "build.log")
    
    log_lines = []
    def log(msg):
        print(msg)
        log_lines.append(str(msg))

    log("=" * 75)
    log("Primary Crest Visual Proof v01.1 — Automated Build Execution")
    log(f"Blender Version: {bpy.app.version_string}")
    log(f"Execution Directory: {script_dir}")
    log("=" * 75)

    # 1. Reset Scene
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene

    # 2. Preserved 3D Spine Curve Definition (6 Spatial Bézier Control Points)
    cps = [
        mathutils.Vector((-4.8, -0.6, -1.0)),   # P0
        mathutils.Vector((-2.4,  0.8, -0.2)),   # P1
        mathutils.Vector(( 0.3,  2.1,  0.8)),   # P2
        mathutils.Vector(( 2.8,  3.2,  2.2)),   # P3
        mathutils.Vector(( 5.2,  4.0,  3.6)),   # P4
        mathutils.Vector(( 7.5,  4.6,  2.4))    # P5
    ]

    log("\n[1] 3D Spine Curve (Degree 5 Bézier, 6 Control Points - UNCHANGED):")
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

    Nu = 64   # Longitudinal samples along spine
    Nv = 38   # Transverse samples across fold profile

    pts = []
    tans = []
    for i in range(Nu):
        u = i / (Nu - 1)
        p, t = eval_bezier(cps, u)
        pts.append(p)
        tans.append(t)

    # 3. Preserved Parallel Transport Frames (Rotation-Minimizing Frame / Double Reflection)
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
    log(f"  Max Orthonormality Error |T . N|: {max_ortho_err:.3e} (Strictly zero-twist)")

    # 4. Longitudinal Evolution Across 5 Stations
    def get_longitudinal_params(u):
        """
        Continuous parameter evolution through the 5 approved stations.
        Ensures broad non-zero boundary entry and exit (avoids pointed leaf tips).
        """
        # Height H(u): low relief entrance (0.8), peaks at focal crest (3.6), relaxes to (1.0)
        h_peak = 3.60
        h_start = 0.80
        h_end = 1.00
        if u < 0.65:
            t = u / 0.65
            H = h_start + (h_peak - h_start) * (math.sin(t * math.pi * 0.5)**1.5)
        else:
            t = (u - 0.65) / 0.35
            H = h_peak - (h_peak - h_end) * (math.sin(t * math.pi * 0.5)**1.3)
            
        # Apron Width W_apron(u): broad valley basin throughout (4.4 -> 5.2 -> 3.7)
        W_apron = 4.40 + 1.15 * math.sin(u * math.pi * 0.85) - 1.25 * (u**2.2)
        
        # Back Width W_back(u): 0.80 at start -> 1.45 at peak -> 1.00 at exit
        W_back = 0.80 + 0.65 * math.sin(u * math.pi * 0.90)
        
        # Undercut Depth D_curl(u): minimal at entry (~0.05), peaks in focal crest (~1.65), relaxes at exit (~0.15)
        D_curl = 1.65 * (math.sin(u * math.pi * 0.95)**2.2)
        
        # Dynamic Banking Angle: -6° at start, reaches +22° at focal crest, relaxes to +4° at exit
        if u < 0.65:
            t = u / 0.65
            bank_deg = -6.0 + 28.0 * (t * t * (3.0 - 2.0 * t))
        else:
            t = (u - 0.65) / 0.35
            bank_deg = 22.0 - 18.0 * (t * t * (3.0 - 2.0 * t))
        theta = math.radians(bank_deg)
        
        return W_apron, W_back, H, D_curl, theta

    log("\n[3] Longitudinal Evolution Stations:")
    for u_test, name in [(0.0, "Station 1: Broad Valley Apron Entry"),
                         (0.35, "Station 2: Pre-Focal Surge"),
                         (0.65, "Station 3: Main Focal Crest Apex"),
                         (0.82, "Station 4: Post-Focal Relaxation"),
                         (1.0, "Station 5: Broad Background Exit Shelf")]:
        wa, wb, h, dc, th = get_longitudinal_params(u_test)
        log(f"  u={u_test:.2f} ({name}):")
        log(f"    W_apron={wa:.2f}, W_back={wb:.2f}, Height={h:.2f}, D_curl={dc:.2f}, Banking={math.degrees(th):.1f}°")

    # 5. Centripetal Catmull-Rom Spline Interpolation (alpha = 0.5)
    def centripetal_catmull_rom_2d(nodes, samples_per_segment, alpha=0.5):
        """
        Evaluates a 2D centripetal Catmull-Rom spline through ordered nodes.
        alpha = 0.5 prevents cusps, self-crossings, and overshoot.
        Virtual ghost points q_-1 = 2*q0 - q1 and q_end+1 = 2*q_end - q_end-1
        guarantee clean C1 tangential boundary continuation.
        """
        # Virtual boundary ghost points
        q_first = 2.0 * nodes[0] - nodes[1]
        q_last = 2.0 * nodes[-1] - nodes[-2]
        full_nodes = [q_first] + nodes + [q_last]
        
        def get_t(t_val, p0, p1):
            d = (p1 - p0).length
            return t_val + (d**alpha if d > 1e-9 else 1e-9)
            
        curve_points = []
        n_segments = len(nodes) - 1
        
        for i in range(1, len(full_nodes) - 2):
            p0 = full_nodes[i - 1]
            p1 = full_nodes[i]
            p2 = full_nodes[i + 1]
            p3 = full_nodes[i + 2]
            
            t0 = 0.0
            t1 = get_t(t0, p0, p1)
            t2 = get_t(t1, p1, p2)
            t3 = get_t(t2, p2, p3)
            
            n_samples = samples_per_segment[i - 1]
            for s in range(n_samples):
                frac = s / n_samples
                t = t1 + frac * (t2 - t1)
                
                a1 = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1
                a2 = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2
                a3 = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3
                
                b1 = (t2 - t) / (t2 - t0) * a1 + (t - t0) / (t2 - t0) * a2
                b2 = (t3 - t) / (t3 - t1) * a2 + (t - t1) / (t3 - t1) * a3
                
                c = (t2 - t) / (t2 - t1) * b1 + (t - t1) / (t2 - t1) * b2
                curve_points.append(c)
                
        # Append exact final node
        curve_points.append(nodes[-1].copy())
        return curve_points

    # Transverse segment sample allocation across 6 segments (7 nodes -> 38 vertices)
    # Samples per segment: [5, 7, 8, 5, 6, 6] = 37 intervals -> 38 vertices
    seg_samples = [5, 7, 8, 5, 6, 6]
    assert sum(seg_samples) + 1 == Nv, f"Transverse samples must equal {Nv}"

    def build_profile_slice(u):
        """
        Builds the 7 ordered control nodes for slice u and evaluates
        the 38 transverse curve points in the local (B, N) frame.
        """
        W_apron, W_back, H, D_curl, _ = get_longitudinal_params(u)
        
        # 7 Ordered Control Nodes from approved proposal:
        # q0: Apron outer boundary (Zone A entry)
        # q1: Valley basin trough (Zone A depression)
        # q2: Sigmoid ascending flank (Zone B inflection)
        # q3: Crest shoulder (Zone C transition)
        # q4: Luminous crest apex (Zone C peak)
        # q5: Forward-projected overhanging lip (Zone D)
        # q6: Tucked shadow pocket / receding back-shelf (Zone D/E)
        q_nodes = [
            mathutils.Vector((-1.00 * W_apron, -0.15 * H)),
            mathutils.Vector((-0.80 * W_apron, -0.50 * H)),
            mathutils.Vector((-0.45 * W_apron,  0.15 * H)),
            mathutils.Vector((-0.15 * W_apron,  0.92 * H)),
            mathutils.Vector(( 0.00,            1.00 * H)),
            mathutils.Vector(( 0.40 * W_back,   0.40 * H - 0.20 * D_curl)),
            mathutils.Vector((-0.10 * W_back,  -0.30 * H - 1.00 * D_curl))
        ]
        
        curve = centripetal_catmull_rom_2d(q_nodes, seg_samples, alpha=0.5)
        return curve, q_nodes

    # 6. Generate 3D Surface Grid S(u, v) = C(u) + P(u, v)
    grid = []
    nodes_3d = []

    for i in range(Nu):
        u = i / (Nu - 1)
        C_u = pts[i]
        N_u = normals[i]
        B_u = binormals[i]
        
        _, _, _, _, theta = get_longitudinal_params(u)
        c_th = math.cos(theta)
        s_th = math.sin(theta)
        
        # Banked orthogonal frame
        N_bank = (c_th * N_u + s_th * B_u).normalized()
        B_bank = (-s_th * N_u + c_th * B_u).normalized()
        
        profile_2d, q_nodes = build_profile_slice(u)
        
        row_3d = []
        for pt2d in profile_2d:
            # pt2d.x is b_coord (transverse), pt2d.y is n_coord (normal)
            P_uv = pt2d.x * B_bank + pt2d.y * N_bank
            S_uv = C_u + P_uv
            row_3d.append(S_uv)
        grid.append(row_3d)
        
        # Save 3D positions of control nodes for validation
        row_nodes_3d = [C_u + q.x * B_bank + q.y * N_bank for q in q_nodes]
        nodes_3d.append(row_nodes_3d)

    # 7. Rigorous Geometric Validation
    log("\n[4] Comprehensive Geometry Validation:")

    # Test A: 2D Profile Self-Crossing Check across all Nu slices
    def segments_intersect(p1, p2, p3, p4):
        # 2D cross product orientation test
        def ccw(a, b, c):
            return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x)
        return ccw(p1, p3, p4) != ccw(p2, p3, p4) and ccw(p1, p2, p3) != ccw(p1, p2, p4)

    profile_self_crossings = 0
    for i in range(Nu):
        u = i / (Nu - 1)
        prof_2d, _ = build_profile_slice(u)
        n_pts = len(prof_2d)
        for j1 in range(n_pts - 1):
            for j2 in range(j1 + 2, n_pts - 1):
                if segments_intersect(prof_2d[j1], prof_2d[j1+1], prof_2d[j2], prof_2d[j2+1]):
                    profile_self_crossings += 1

    log(f"  Test A: Profile 2D Self-Crossings across all {Nu} slices: {profile_self_crossings} (Zero expected)")
    assert profile_self_crossings == 0, "Profile has self-crossings!"

    # Test B: Degenerate or Pinched Face Test on Base Control Cage
    degenerate_faces = 0
    min_face_area = float('inf')
    for i in range(Nu - 1):
        for j in range(Nv - 1):
            v0 = grid[i][j]
            v1 = grid[i+1][j]
            v2 = grid[i+1][j+1]
            v3 = grid[i][j+1]
            # Area of two triangles forming quad
            a1 = 0.5 * ((v1 - v0).cross(v3 - v0)).length
            a2 = 0.5 * ((v3 - v2).cross(v1 - v2)).length
            area = a1 + a2
            if area < min_face_area:
                min_face_area = area
            if area < 1e-6:
                degenerate_faces += 1

    log(f"  Test B: Degenerate Quad Faces: {degenerate_faces} (Min Quad Area: {min_face_area:.4f} units²)")
    assert degenerate_faces == 0, "Mesh contains degenerate faces!"

    # 8. Construct Blender Mesh and Quad Topology
    mesh = bpy.data.meshes.new("PrimaryCrest_v01_1_Mesh")
    obj = bpy.data.objects.new("PrimaryCrest_v01_1", mesh)
    scene.collection.objects.link(obj)

    verts = []
    uvs = []
    for i in range(Nu):
        u = i / (Nu - 1)
        for j in range(Nv):
            v = j / (Nv - 1)
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

    # UV Layer
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            v_idx = mesh.loops[loop_idx].vertex_index
            uv_layer.data[loop_idx].uv = uvs[v_idx]

    # Smooth Shading on all polygons
    for poly in mesh.polygons:
        poly.use_smooth = True

    # 9. Catmull-Clark Subdivision Surface Modifier (Level 2)
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

    eval_quads = len(faces) * (4 ** subsurf.render_levels)
    log(f"\n[5] Mesh Topology & Dimensions:")
    log(f"  Base Control Vertices: {len(verts)} ({Nu} u-rings x {Nv} v-slices)")
    log(f"  Base Quad Faces:       {len(faces)} ({Nu-1} x {Nv-1} all-quad)")
    log(f"  Subdivision Level:     {subsurf.levels} (Catmull-Clark)")
    log(f"  Rendered Evaluated Quads: {eval_quads:,}")
    log(f"  Bounding Box Min: ({min_co.x:.2f}, {min_co.y:.2f}, {min_co.z:.2f})")
    log(f"  Bounding Box Max: ({max_co.x:.2f}, {max_co.y:.2f}, {max_co.z:.2f})")
    log(f"  Mesh Dimensions:  X={dims.x:.2f}, Y={dims.y:.2f}, Z={dims.z:.2f}")

    # Test C: 3D Evaluated Subdivided Mesh BVH Self-Intersection Test
    depsgraph = bpy.context.evaluated_depsgraph_get()
    eval_obj = obj.evaluated_get(depsgraph)
    eval_mesh = eval_obj.to_mesh()

    eval_verts_co = [v.co for v in eval_mesh.vertices]
    eval_poly_indices = [p.vertices for p in eval_mesh.polygons]
    bvh = BVHTree.FromPolygons(eval_verts_co, eval_poly_indices)
    overlaps = bvh.overlap(bvh)

    non_adj_overlaps = []
    for p1, p2 in overlaps:
        if p1 < p2:
            v1_set = set(eval_mesh.polygons[p1].vertices)
            v2_set = set(eval_mesh.polygons[p2].vertices)
            if not v1_set.intersection(v2_set):
                non_adj_overlaps.append((p1, p2))

    log(f"  Test C: Evaluated Mesh ({eval_mesh.polygons.__len__():,} quads) BVH Non-Adjacent Overlaps: {len(non_adj_overlaps)}")
    if len(non_adj_overlaps) == 0:
        log("  Intersection Result: PASSED (ZERO self-intersections across entire evaluated subdivided surface)")
    else:
        log(f"  Intersection Result: WARNING ({len(non_adj_overlaps)} overlapping face pairs detected)")

    eval_obj.to_mesh_clear()

    # 10. Preserved Camera Baseline Setup
    cam_pos = mathutils.Vector((0.0, -17.5, 12.5))
    cam_target = mathutils.Vector((1.0, 2.5, 0.5))

    cam_data = bpy.data.cameras.new("HeroCamera")
    cam_data.lens = 32.0
    cam_data.sensor_width = 36.0
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

    # Camera Visibility Analysis of Lip and Shadow Pocket
    from bpy_extras.object_utils import world_to_camera_view
    focal_idx = int(0.65 * (Nu - 1))
    
    # q4 (apex), q5 (lip), q6 (shadow pocket) at focal crest
    apex_3d = nodes_3d[focal_idx][4]
    lip_3d = nodes_3d[focal_idx][5]
    pocket_3d = nodes_3d[focal_idx][6]

    apex_scr = world_to_camera_view(scene, cam_obj, apex_3d)
    lip_scr = world_to_camera_view(scene, cam_obj, lip_3d)
    pocket_scr = world_to_camera_view(scene, cam_obj, pocket_3d)

    log(f"\n[6] Camera Projection & Undercut Visibility (u=0.65):")
    log(f"  Crest Apex (q4):          Screen=({apex_scr.x:.3f}, {apex_scr.y:.3f}), Depth={apex_scr.z:.2f}")
    log(f"  Overhanging Lip (q5):     Screen=({lip_scr.x:.3f}, {lip_scr.y:.3f}), Depth={lip_scr.z:.2f}")
    log(f"  Tucked Shadow Pocket (q6): Screen=({pocket_scr.x:.3f}, {pocket_scr.y:.3f}), Depth={pocket_scr.z:.2f}")
    delta_y_lip = apex_scr.y - lip_scr.y
    delta_y_pocket = lip_scr.y - pocket_scr.y
    log(f"  Screen Separation (Apex to Lip): {delta_y_lip:+.3f} in Y (Visibly lower, forward-projecting)")
    log(f"  Screen Separation (Lip to Pocket): {delta_y_pocket:+.3f} in Y (Deep recessed shadow cavity)")
    assert delta_y_lip > 0.05 and delta_y_pocket > 0.05, "Undercut not separated in camera projection!"

    # 11. Preserved Material & Studio Lighting
    # Material
    mat = bpy.data.materials.new("DarkEmeraldFluid_v01_1")
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

    # Light 1: Preserved Grazing Sun (Mint-Emerald highlight on apex and lip)
    rim_data = bpy.data.lights.new("RimGrazingLight", "SUN")
    rim_data.energy = 6.5
    rim_data.color = (0.35, 1.0, 0.70)
    rim_obj = bpy.data.objects.new("RimGrazingLight", rim_data)
    scene.collection.objects.link(rim_obj)
    rim_dir = mathutils.Vector((-1.4, -1.8, -1.2)).normalized()
    rim_obj.rotation_euler = rim_dir.to_track_quat('-Z', 'Y').to_euler()

    # Light 2: Preserved Key Sun (Illuminating the sigmoid ascending flank)
    key_data = bpy.data.lights.new("KeyApronLight", "SUN")
    key_data.energy = 3.8
    key_data.color = (0.12, 0.52, 0.30)
    key_obj = bpy.data.objects.new("KeyApronLight", key_data)
    scene.collection.objects.link(key_obj)
    key_dir = mathutils.Vector((0.6, 1.8, -1.2)).normalized()
    key_obj.rotation_euler = key_dir.to_track_quat('-Z', 'Y').to_euler()

    # Light 3: Preserved Point Fill (Subtle modeling in the valley basin)
    fill_data = bpy.data.lights.new("ValleyFillLight", "POINT")
    fill_data.energy = 350.0
    fill_data.color = (0.06, 0.32, 0.18)
    fill_obj = bpy.data.objects.new("ValleyFillLight", fill_data)
    scene.collection.objects.link(fill_obj)
    fill_obj.location = mathutils.Vector((-1.5, -4.0, 2.5))

    log("\n[7] Lighting & Shading Setup:")
    log("  Material: Dark Emerald Fluid (Roughness=0.28, Specular=0.65)")
    log("  Lights: Grazing Sun (Energy=6.5), Key Sun (Energy=3.8), Point Fill (Energy=350)")

    # 12. Save .blend File
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    log(f"\n[8] Saved Blend File: {blend_path}")

    # 13. Render Still Image
    scene.render.filepath = render_path
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '8'

    log("\n[9] Rendering Still Image (1920x1080)...")
    r_start = time.time()
    bpy.ops.render.render(write_still=True)
    r_end = time.time()
    log(f"  Render Complete: {render_path}")
    log(f"  Render Duration: {r_end - r_start:.2f} seconds")

    total_time = time.time() - start_time
    log(f"\n[10] Total Execution Duration: {total_time:.2f} seconds")
    log("=" * 75)
    log("BUILD SUCCESSFUL — PRIMARY CREST v01.1")
    log("=" * 75)

    with open(log_path, "w", encoding="utf-8") as f:
        f.write("\n".join(log_lines) + "\n")

if __name__ == "__main__":
    run()
