"use client"

import dynamic from "next/dynamic";
import { Project } from "@/types/project";

const ProjectDashboard = dynamic(() => import("@/components/projects/project-dashboard"), {
  ssr: false,
  loading: () => (
    <div className="h-page-content max-h-page-content w-full rounded-md border border-border bg-dashboard" />
  ),
})

interface DeferredProjectDashboardProps {
  projects: Project[]
}

export default function DeferredProjectDashboard({ projects }: DeferredProjectDashboardProps) {
  return <ProjectDashboard projects={projects} />
}
