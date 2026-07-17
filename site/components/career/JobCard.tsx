"use client";

import { Button } from "@/components/ui/Button";
import { CAREER_PAGE_COPY } from "@/features/site/data/routeCopy";

interface JobCardProps {
    title: string;
    department: string;
    location?: string;
    onClick?: () => void;
}

export function JobCard({ title, department, location = "Patna", onClick }: JobCardProps) {
    const applyHref = `mailto:${CAREER_PAGE_COPY.careersEmail}?subject=${encodeURIComponent(`Application: ${title}`)}`;
    const detailsLabel = `View details for ${title}`;

    return (
        <div className="scheme-panel scheme-border group flex flex-col items-start justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-theme-lift md:flex-row md:items-center">
            <div>
                <h3 className="typ-h3 text-strong transition-colors group-hover:text-primary">
                    {title}
                </h3>
                <p className="page-copy-sm text-body mt-1">
                    {location} | {department}
                </p>
            </div>
            {onClick ? (
                <Button
                    variant="outline"
                    className="mt-4 md:mt-0"
                    onClick={onClick}
                    aria-label={detailsLabel}
                >
                    View Details
                </Button>
            ) : (
                <Button asChild variant="outline" className="mt-4 md:mt-0">
                    <a href={applyHref} aria-label={detailsLabel}>
                        View Details
                    </a>
                </Button>
            )}
        </div>
    );
}
