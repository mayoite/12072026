export { Lazy3DViewer } from "./ThreeLazyViewer";
export {
  OPEN3D_ORBIT_DEFAULT_ENABLED,
  getOpen3dViewerControlProps,
} from "./orbitDefaults";
// Removed dead re-exports (checkCanLoad3D, isDeviceCapable, isWebGLSupported) — never imported via this barrel in open3d sources or consumers (direct imports used); reduces dead exports.
