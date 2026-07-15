import type { SvgEditorFormState } from "../../form/svgEditorFormState";
import type { AuthoringLifecycle } from "../../lifecycle/authoringLifecycle";
import type { CatalogLifecycleState } from "../../lifecycle/catalogLifecycle.shared";
import type { SvgPreviewResult } from "../../publish/previewSvgEditorAction";
import type { SvgArtifactStatus } from "../../publish/svgArtifactStatus.server";
import type { FeedbackState } from "./useAdminSvgEditorPublish";

export type AdminSvgPreviewResult = SvgPreviewResult;

export interface AdminSvgStageMeta {
  readonly identity: string;
  readonly footprint: string;
  readonly draft: string;
  readonly validation: string;
  readonly revision: string;
}

export interface AdminSvgEditorShellProps {
  readonly slug: string;
  readonly updatedAtLabel: string;
  readonly form: SvgEditorFormState;
  readonly formDirty: boolean;
  readonly formIssues: ReadonlyArray<{ path: string; message: string }>;
  readonly coreFieldIssuesCount: number;
  readonly preview: AdminSvgPreviewResult | null;
  readonly previewPending: boolean;
  readonly feedback: FeedbackState;
  readonly authoringLifecycle: AuthoringLifecycle;
  readonly lifecycle: CatalogLifecycleState;
  readonly artifactStatus: SvgArtifactStatus;
  readonly publishImpactLabel: string;
  readonly approving: boolean;
  readonly canPublish: boolean;
  readonly canConvertToGlb: boolean;
  readonly glbSourceSvg: string | null;
  readonly glbUrl: string;
  readonly glbUploading: boolean;
  readonly glbUploadError: string | null;
  readonly stageMeta: AdminSvgStageMeta;
  readonly studioResetKey: number;
  readonly plannerVerifyHref: string;
  readonly publishArtifactHref: (productSlug: string) => string;
  readonly onFormChange: (next: SvgEditorFormState) => void;
  readonly onDismissFeedback: () => void;
  readonly onResetToPublished: () => void;
  readonly onApproveForBuyers: () => void;
  readonly onPublish: () => void;
  readonly onStartGlbConversion: () => void;
  readonly onGlbGenerated: (blob: Blob) => Promise<void>;
  readonly onDocument: (svg: string, excalidrawElements: unknown) => void;
  readonly onError: (message: string) => void;
}
