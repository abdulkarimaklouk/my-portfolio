"""
Multi-Patch Pilot 01 — Single Surface Validation (build_pilot.py)
-----------------------------------------------------------------
Role: Senior 3D Technical Artist & Geometry Engineer
Architecture: Candidate D — Hybrid Multi-Patch Architecture
              (Independent Bivariate 3D Quad Control Cage -> Catmull-Clark Subdivision)

Objective:
  Construct ONE continuous organic 3D surface patch representing Structure B
  (the dominant primary crest and undulating apron basin) using an authored 3D
  bivariate quad control cage P(u, v) = (X(u, v), Y(u, v), Z(u, v)).

Deliverables:
  - pilot-01.blend: Fully configured Blender scene
  - render-hero.png: Primary composition view
  - render-oblique.png: 3/4 elevated perspective showing compound double curvature
  - render-side.png: Profile / side silhouette view proving the physical undercut
  - render-control-cage.png: Control cage inspection view with wireframe overlay

Execution:
  blender-launcher -b --python build_pilot.py
"""

import bpy
import bmesh
import mathutils
from mathutils import Vector, Matrix
import math
import time
import os
import sys

def clamp(val, low, high):
    return max(low, min(high, val))

def build_pilot():
    start_time = time.time()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    blend_path = os.path.join(script_dir, "pilot-01.blend")
    log_path = os.path.join(script_dir, "build.log")

    render_paths = {
        "hero": os.path.join(script_dir, "render-hero.png"),
        "oblique": os.path.join(script_dir, "render-oblique.png"),
        "side": os.path.join(script_dir, "render-side.png"),
        "cage": os.path.join(script_dir, "render-control-cage.png"),
    }

    log_lines = []
    def log(msg):
        print(msg)
        log_lines.append(str(msg))

    log("=" * 80)
    log("MULTI-PATCH PILOT 01 — SINGLE SURFACE VALIDATION BUILD")
    log(f"Blender Version: {bpy.app.version_string}")
    log(f"Target Directory: {script_dir}")
    log("=" * 80)

    # 1. Reset Scene
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    log(f"[1] Render Engine: {scene.render.engine}")

    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '8'

    # 2. Bivariate 3D Quad Control Cage Definition
    # Grid dimensions: Nu longitudinal rows x Nv transverse columns
    Nu = 14  # Longitudinal rows along diagonal flow (u in [0, 1])
    Nv = 11  # Transverse columns across apron, flank, apex, undercut (v in [0, 1])

    log(f"\n[2] Generating Bivariate 3D Quad Control Cage ({Nu} x {Nv} = {Nu * Nv} vertices):")

    # Non-linear transverse parameter s(j) clustering control loops around the crest apex:
    # j=0..2: Apron edge & basin trough
    # j=3..6: Ascending flank & shoulder
    # j=7: Pre-crest support loop
    # j=8: Crest apex ridge
    # j=9: Overhanging lip
    # j=10: Tucked under-shelf
    s_table = [0.00, 0.10, 0.22, 0.36, 0.50, 0.63, 0.74, 0.81, 0.86, 0.93, 1.00]

    def evaluate_surface_point(u, j_idx):
        s = s_table[j_idx]

        # A. Longitudinal Crest Backbone
        # Sweeps diagonally from lower-left (-7.2) to upper-right (+6.8)
        # S-curve path with organic diagonal flow
        xCrest = -7.2 + 14.0 * u + 0.8 * math.sin(math.pi * u)
        # Deep spatial arc in Y: sweeps from foreground (-2.2) to midground (+1.8) and back
        yCrest = -2.2 + 4.8 * u - 1.8 * math.sin(math.pi * (u ** 1.1))
        # Elevation profile: rises from 0.4 to a strong focal crest peak at u=0.68 (Z=3.8), then tapers
        zCrest = 0.4 + 3.4 * math.pow(math.sin(math.pi * (u ** 0.75)), 1.3)

        # Dynamic banking angle: crest tilts forward towards camera by up to 25 deg at peak surge
        bank_angle = math.radians(12.0 + 18.0 * math.sin(math.pi * (u ** 0.85)))

        # Longitudinal Modulation Metrics
        # Apron flaring width: expands dramatically in mid-surge, forming a wide fluid basin
        W_apron = 4.2 + 4.5 * math.sin(math.pi * (u ** 0.80)) - 1.8 * (u ** 2)
        # Deep valley basin depression: dips up to -3.4 below ground
        D_basin = 1.6 + 2.4 * math.sin(math.pi * (u ** 0.80))
        # Curl radius & max curl angle for the overhanging lip
        R_curl = 0.60 + 0.85 * math.sin(math.pi * (u ** 0.85))
        Theta_max = math.radians(140.0 + 40.0 * math.sin(math.pi * (u ** 0.85)))

        # Organic boundary tapering at extremities (u -> 0 and u -> 1)
        taper_start = math.sin(clamp(u / 0.15, 0.0, 1.0) * math.pi * 0.5)
        taper_end = math.sin(clamp((1.0 - u) / 0.18, 0.0, 1.0) * math.pi * 0.5)
        edge_taper = taper_start * taper_end

        if s <= 0.36:
            # Zone 1: Apron Basin & Valley Trough (s in [0, 0.36])
            # Compound anticlastic saddle: transversely concave, longitudinally swept
            t = s / 0.36
            # Transverse flaring outward in -Y (toward camera / left-center)
            yRel = -W_apron * (1.0 - 0.65 * t)
            # Valley floor drops deeply at s ~ 0.10 (t ~ 0.28)
            trough_profile = math.cos(math.pi * t)
            # 2D saddle term: longitudinal basin scoop
            saddle_scoop = -1.2 * math.sin(math.pi * u) * math.sin(math.pi * t)
            zRel = -D_basin * (0.50 + 0.50 * trough_profile) + saddle_scoop
            # Non-planar diagonal shear lag in X: apron lags behind the crest
            xRel = -2.8 * (1.0 - t) * (1.0 - 0.30 * u)
            
            x = xCrest + xRel
            y = yCrest + yRel
            z = zRel * edge_taper

        elif s <= 0.86:
            # Zone 2: Ascending Flank & Crest Shoulder (s in [0.36, 0.86])
            # Smooth tensioned sigmoid connecting valley trough to crest apex with compound saddle
            t = (s - 0.36) / (0.86 - 0.36)
            # Sigmoid blending with non-linear tension
            S = 3.0 * (t ** 2) - 2.0 * (t ** 3)
            
            # Flank base values (at s = 0.36)
            yBase = -W_apron * 0.35
            zBase = -D_basin * 0.12 - 1.2 * math.sin(math.pi * u)
            xBase = -0.6 * (1.0 - 0.30 * u)

            # Compound curvature: flank concavity transitioning to crest convexity
            mid_bulge = 0.85 * math.sin(math.pi * t) * math.sin(math.pi * (u ** 0.9))
            
            # Smooth interpolation up the flank to the crest apex
            yRel = yBase * (1.0 - S) - math.sin(bank_angle) * S * 0.8
            zRel = (zBase * (1.0 - S) + zCrest * S) - mid_bulge
            xRel = xBase * (1.0 - t)

            x = xCrest + xRel
            y = yCrest + yRel
            z = zRel

        else:
            # Zone 3: Overhanging Lip & Tucked Shadow Pocket (s in [0.86, 1.00])
            # Folds forward and rolls underneath the crest (genuine geometric undercut)
            t = (s - 0.86) / (1.00 - 0.86)
            angle = t * Theta_max

            # Apply banking tilt to the curl coordinate frame
            rawDY = R_curl * math.sin(angle)
            rawDZ = -R_curl * (1.0 - math.cos(angle))

            # Rotate by bank_angle
            deltaY = rawDY * math.cos(bank_angle) - rawDZ * math.sin(bank_angle)
            deltaZ = rawDY * math.sin(bank_angle) + rawDZ * math.cos(bank_angle)
            deltaX = 0.35 * R_curl * math.sin(angle) * (1.0 - 0.3 * (1.0 - edge_taper))

            x = xCrest + deltaX
            y = yCrest + deltaY
            # Taper end of lip gracefully into distance
            z = zCrest + deltaZ * (0.4 + 0.6 * edge_taper)

        return Vector((x, y, z))

    # Evaluate all control cage vertices
    grid_pts = []
    for i in range(Nu):
        u = i / (Nu - 1)
        row = []
        for j in range(Nv):
            pt = evaluate_surface_point(u, j)
            row.append(pt)
        grid_pts.append(row)

    # 3. Construct BMesh Quad Control Cage
    bm = bmesh.new()
    vertex_grid = []
    for i in range(Nu):
        v_row = []
        for j in range(Nv):
            v = bm.verts.new(grid_pts[i][j])
            v_row.append(v)
        vertex_grid.append(v_row)

    bm.verts.ensure_lookup_table()

    # Create quad faces
    faces = []
    for i in range(Nu - 1):
        for j in range(Nv - 1):
            v00 = vertex_grid[i][j]
            v10 = vertex_grid[i + 1][j]
            v11 = vertex_grid[i + 1][j + 1]
            v01 = vertex_grid[i][j + 1]
            f = bm.faces.new((v00, v10, v11, v01))
            faces.append(f)

    bm.faces.ensure_lookup_table()
    bm.normal_update()

    # Calculate spatial bounding box and metrics
    all_x = [pt.x for row in grid_pts for pt in row]
    all_y = [pt.y for row in grid_pts for pt in row]
    all_z = [pt.z for row in grid_pts for pt in row]

    min_x, max_x = min(all_x), max(all_x)
    min_y, max_y = min(all_y), max(all_y)
    min_z, max_z = min(all_z), max(all_z)

    log(f"  Cage Vertices: {len(bm.verts)}, Quad Faces: {len(bm.faces)}")
    log(f"  Spatial Bounds:")
    log(f"    X: [{min_x:+.2f}, {max_x:+.2f}] (Span: {max_x - min_x:.2f})")
    log(f"    Y: [{min_y:+.2f}, {max_y:+.2f}] (Span: {max_y - min_y:.2f})")
    log(f"    Z: [{min_z:+.2f}, {max_z:+.2f}] (Span: {max_z - min_z:.2f})")

    # Undercut verification at peak surge (u ~ 0.65, row i = 9)
    focal_i = 9
    apex_pt = grid_pts[focal_i][8]  # j=8 is apex
    lip_pt = grid_pts[focal_i][9]   # j=9 is lip
    pocket_pt = grid_pts[focal_i][10] # j=10 is tucked pocket

    log(f"\n[3] Geometric Undercut Analysis (Focal Section u={focal_i/(Nu-1):.2f}):")
    log(f"  Apex Position (j=8):   ({apex_pt.x:+.2f}, {apex_pt.y:+.2f}, {apex_pt.z:+.2f})")
    log(f"  Lip Position (j=9):    ({lip_pt.x:+.2f}, {lip_pt.y:+.2f}, {lip_pt.z:+.2f})")
    log(f"  Pocket Position (j=10):({pocket_pt.x:+.2f}, {pocket_pt.y:+.2f}, {pocket_pt.z:+.2f})")
    log(f"  Vertical Drop (Apex -> Pocket): {apex_pt.z - pocket_pt.z:+.2f} units")
    log(f"  Lip Forward Projection:         {lip_pt.y - apex_pt.y:+.2f} units in Y")
    log(f"  Pocket Tucked Backward:         {pocket_pt.y - lip_pt.y:+.2f} units in Y (Under-fold confirmed)")

    assert lip_pt.y > apex_pt.y and pocket_pt.y < lip_pt.y, "Geometry does not exhibit true under-curl!"

    # 4. Create Blender Mesh & Object
    mesh_data = bpy.data.meshes.new("MultiPatch_Pilot01_Mesh")
    bm.to_mesh(mesh_data)
    bm.free()

    obj = bpy.data.objects.new("MultiPatch_Pilot01", mesh_data)
    scene.collection.objects.link(obj)

    # Enable smooth shading on all polygons
    for poly in mesh_data.polygons:
        poly.use_smooth = True

    # 5. Add Catmull-Clark Subdivision Modifier
    subsurf = obj.modifiers.new(name="CatmullClark_Subdivision", type='SUBSURF')
    subsurf.subdivision_type = 'CATMULL_CLARK'
    subsurf.levels = 2
    subsurf.render_levels = 3
    log(f"\n[4] Catmull-Clark Subdivision Modifier applied: Viewport Levels=2, Render Levels=3")

    # 6. Neutral Studio Clay Material
    mat_clay = bpy.data.materials.new("NeutralStudioClay")
    mat_clay.use_nodes = True
    nodes = mat_clay.node_tree.nodes
    links = mat_clay.node_tree.links
    nodes.clear()

    out_node = nodes.new("ShaderNodeOutputMaterial")
    bsdf_node = nodes.new("ShaderNodeBsdfPrincipled")
    # Neutral warm studio clay
    bsdf_node.inputs["Base Color"].default_value = (0.58, 0.56, 0.53, 1.0)
    bsdf_node.inputs["Roughness"].default_value = 0.38
    bsdf_node.inputs["Metallic"].default_value = 0.0
    if "Specular IOR Level" in bsdf_node.inputs:
        bsdf_node.inputs["Specular IOR Level"].default_value = 0.50
    elif "Specular" in bsdf_node.inputs:
        bsdf_node.inputs["Specular"].default_value = 0.50

    links.new(bsdf_node.outputs["BSDF"], out_node.inputs["Surface"])
    obj.data.materials.append(mat_clay)
    log("[5] Material established: Neutral Studio Clay (Base Color: (0.58, 0.56, 0.53), Roughness: 0.38)")

    # 7. World Environment & Studio Lighting Setup
    world = bpy.data.worlds.new("StudioDarkSlateWorld")
    world.use_nodes = True
    w_nodes = world.node_tree.nodes
    w_nodes.clear()
    w_out = w_nodes.new("ShaderNodeOutputWorld")
    w_bg = w_nodes.new("ShaderNodeBackground")
    # Dark neutral slate background
    w_bg.inputs["Color"].default_value = (0.012, 0.015, 0.020, 1.0)
    w_bg.inputs["Strength"].default_value = 0.25
    world.node_tree.links.new(w_bg.outputs["Background"], w_out.inputs["Surface"])
    scene.world = world

    # Light 1: Key Grazing Sun (High-angle directional light skimming the crest apex)
    key_data = bpy.data.lights.new("KeyGrazingLight", "SUN")
    key_data.energy = 5.5
    key_data.color = (1.0, 0.98, 0.94)
    key_obj = bpy.data.objects.new("KeyGrazingLight", key_data)
    scene.collection.objects.link(key_obj)
    # Direction aimed diagonally down from upper-right
    key_dir = Vector((-1.8, -1.2, -1.5)).normalized()
    key_obj.rotation_euler = key_dir.to_track_quat('-Z', 'Y').to_euler()

    # Light 2: Soft Diffuse Fill (Soft fill revealing the apron basin & ascending flank)
    fill_data = bpy.data.lights.new("SoftFillLight", "SUN")
    fill_data.energy = 2.2
    fill_data.color = (0.75, 0.82, 0.90)
    fill_obj = bpy.data.objects.new("SoftFillLight", fill_data)
    scene.collection.objects.link(fill_obj)
    fill_dir = Vector((1.2, 1.8, -0.8)).normalized()
    fill_obj.rotation_euler = fill_dir.to_track_quat('-Z', 'Y').to_euler()

    # Light 3: Cavity / Undercut Bounce Light (Point light softly illuminating the under-shelf)
    bounce_data = bpy.data.lights.new("UndercutBounceLight", "POINT")
    bounce_data.energy = 450.0
    bounce_data.color = (0.60, 0.70, 0.85)
    bounce_data.shadow_soft_size = 0.8
    bounce_obj = bpy.data.objects.new("UndercutBounceLight", bounce_data)
    bounce_obj.location = Vector((2.5, 1.5, 0.5))
    scene.collection.objects.link(bounce_obj)

    log("[6] Studio Lighting Setup:")
    log("    - Key Grazing Sun: Energy 5.5 (Warm White)")
    log("    - Soft Diffuse Fill Sun: Energy 2.2 (Cool White)")
    log("    - Undercut Bounce Point: Energy 450.0 (Cavity bounce at (2.5, 1.5, 0.5))")

    # 8. Camera Setups for Required Views
    def create_camera(name, location, target, focal_length=45.0):
        cam_data = bpy.data.cameras.new(name)
        cam_data.lens = focal_length
        cam_data.sensor_width = 36.0
        cam_obj = bpy.data.objects.new(name, cam_data)
        cam_obj.location = location
        dir_vec = (target - location).normalized()
        cam_obj.rotation_euler = dir_vec.to_track_quat('-Z', 'Y').to_euler()
        scene.collection.objects.link(cam_obj)
        return cam_obj

    # Camera 1: Hero Primary Composition View (Diagonal crest sweep matching hero-fluid-mesh-primary.jpg)
    cam_hero = create_camera("Camera_Hero", Vector((-6.5, -16.5, 6.2)), Vector((0.6, 0.5, 1.4)), focal_length=40.0)

    # Camera 2: Oblique View (Elevated 3/4 perspective demonstrating compound double curvature & 3D volume)
    cam_oblique = create_camera("Camera_Oblique", Vector((-11.0, -12.5, 11.5)), Vector((0.2, 0.0, 0.6)), focal_length=38.0)

    # Camera 3: Side / Profile Silhouette View (Revealing the cross-section silhouette & physical overhang curl)
    # Look directly along the crest ridge at the focal curl zone (X ~ 3.0, Y ~ 0.5, Z ~ 2.5)
    cam_side = create_camera("Camera_Side", Vector((11.8, 5.8, 3.2)), Vector((2.8, 0.4, 2.0)), focal_length=65.0)

    log("[7] Camera Setups created:")
    log(f"    - Camera_Hero: Pos={cam_hero.location}, Target=(0.8, 0.8, 1.0)")
    log(f"    - Camera_Oblique: Pos={cam_oblique.location}, Target=(0.5, 0.2, 0.8)")
    log(f"    - Camera_Side: Pos={cam_side.location}, Target=(2.5, 0.2, 1.8)")

    # 9. Create Control Cage Inspection Overlay Object for View 4
    # Create duplicate mesh of the unsubdivided cage with a dark wireframe material
    cage_mesh_data = bpy.data.meshes.new("ControlCage_WireMesh")
    bm_cage = bmesh.new()
    for row in grid_pts:
        for pt in row:
            bm_cage.verts.new(pt)
    bm_cage.verts.ensure_lookup_table()
    for i in range(Nu - 1):
        for j in range(Nv - 1):
            v00 = bm_cage.verts[i * Nv + j]
            v10 = bm_cage.verts[(i + 1) * Nv + j]
            v11 = bm_cage.verts[(i + 1) * Nv + (j + 1)]
            v01 = bm_cage.verts[i * Nv + (j + 1)]
            bm_cage.faces.new((v00, v10, v11, v01))
    bm_cage.to_mesh(cage_mesh_data)
    bm_cage.free()

    cage_obj = bpy.data.objects.new("ControlCage_Overlay", cage_mesh_data)
    scene.collection.objects.link(cage_obj)

    # Wireframe modifier on cage overlay
    wf_mod = cage_obj.modifiers.new(name="Wireframe_Modifier", type='WIREFRAME')
    wf_mod.thickness = 0.045
    wf_mod.use_replace = True

    # Dark cyan/slate material for wireframe cage
    mat_cage = bpy.data.materials.new("CageWireframeMaterial")
    mat_cage.use_nodes = True
    c_nodes = mat_cage.node_tree.nodes
    c_nodes.clear()
    c_out = c_nodes.new("ShaderNodeOutputMaterial")
    c_bsdf = c_nodes.new("ShaderNodeBsdfPrincipled")
    c_bsdf.inputs["Base Color"].default_value = (0.08, 0.55, 0.65, 1.0) # Bright cyan-slate
    c_bsdf.inputs["Roughness"].default_value = 0.3
    if "Emission Color" in c_bsdf.inputs:
        c_bsdf.inputs["Emission Color"].default_value = (0.05, 0.40, 0.50, 1.0)
        c_bsdf.inputs["Emission Strength"].default_value = 0.6
    mat_cage.node_tree.links.new(c_bsdf.outputs["BSDF"], c_out.inputs["Surface"])
    cage_obj.data.materials.append(mat_cage)

    # Initially hide cage overlay so views 1-3 render clean clay
    cage_obj.hide_render = True

    # 10. Save .blend File
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    log(f"\n[8] Saved Blender Scene File: {blend_path}")

    # 11. Render Still Views
    log("\n[9] Rendering Required Deliverable Views (1920x1080):")

    # View 1: render-hero.png
    scene.camera = cam_hero
    scene.render.filepath = render_paths["hero"]
    log("  [Render 1/4] Rendering render-hero.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['hero']}")

    # View 2: render-oblique.png
    scene.camera = cam_oblique
    scene.render.filepath = render_paths["oblique"]
    log("  [Render 2/4] Rendering render-oblique.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['oblique']}")

    # View 3: render-side.png
    scene.camera = cam_side
    scene.render.filepath = render_paths["side"]
    log("  [Render 3/4] Rendering render-side.png...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['side']}")

    # View 4: render-control-cage.png
    # Enable cage overlay and render from oblique view
    cage_obj.hide_render = False
    scene.camera = cam_oblique
    scene.render.filepath = render_paths["cage"]
    log("  [Render 4/4] Rendering render-control-cage.png (Oblique view with wireframe cage overlay)...")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    log(f"    Completed in {time.time() - t0:.2f}s -> {render_paths['cage']}")

    # Re-hide cage overlay and save blend file in final clean state
    cage_obj.hide_render = True
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)

    total_time = time.time() - start_time
    log("\n" + "=" * 80)
    log(f"MULTI-PATCH PILOT 01 BUILD COMPLETE in {total_time:.2f} seconds")
    log("=" * 80)

    with open(log_path, "w", encoding="utf-8") as f:
        f.write("\n".join(log_lines) + "\n")

if __name__ == "__main__":
    import traceback
    try:
        build_pilot()
    except Exception as e:
        log_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "build.log")
        with open(log_path, "w", encoding="utf-8") as f:
            f.write("BUILD FAILED WITH EXCEPTION:\n" + traceback.format_exc())
        raise
