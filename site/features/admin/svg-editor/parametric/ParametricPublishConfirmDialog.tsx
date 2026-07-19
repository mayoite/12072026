"use client";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import type { ParametricIdentity } from "./authoringTypes";

export function ParametricPublishConfirmDialog({ open, identity, summary, onClose, onConfirm }: { readonly open: boolean; readonly identity: ParametricIdentity; readonly summary: string; readonly onClose: () => void; readonly onConfirm: () => void }) {
  return <ModalOverlay className="parametric-publish-overlay" isOpen={open} isDismissable onOpenChange={(next) => { if (!next) onClose(); }}><Modal className="parametric-publish-modal"><Dialog className="parametric-publish-dialog" aria-label="Publish product">{({ close }) => <><Heading slot="title" className="parametric-publish-heading">Publish product</Heading><dl className="parametric-publish-summary"><div><dt>Name</dt><dd>{identity.name}</dd></div><div><dt>SKU</dt><dd>{identity.sku}</dd></div><div><dt>Slug</dt><dd>{identity.slug}</dd></div><div><dt>Size</dt><dd>{summary}</dd></div></dl><p>Publishing makes this exact configuration available to Planner.</p><div className="parametric-publish-actions"><Button className="parametric-publish-cancel" onPress={() => { close(); onClose(); }}>Cancel</Button><Button className="parametric-publish-confirm" onPress={onConfirm}>Publish</Button></div></>}</Dialog></Modal></ModalOverlay>;
}
