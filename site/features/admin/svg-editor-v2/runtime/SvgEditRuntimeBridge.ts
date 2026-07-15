export class SvgEditRuntimeBridge {
  private svg = "<svg />";
  private checksum = "";

  constructor(private readonly options: { readonly href: string }) {}

  load(svg: string, checksum: string) {
    this.svg = svg;
    this.checksum = checksum;
    return this.read();
  }

  read() {
    return { svg: this.svg, checksum: this.checksum, href: this.options.href };
  }

  apply(svg: string, baseChecksum: string, checksum: string) {
    if (baseChecksum !== this.checksum) {
      return { ok: false as const, reason: "stale-checksum" as const, ...this.read() };
    }
    this.svg = svg;
    this.checksum = checksum;
    return { ok: true as const, ...this.read() };
  }
}
