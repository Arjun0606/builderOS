import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProjectCard } from '@/components/projects/project-card'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's organization
  const { data: userProfile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!userProfile?.organization_id) {
    redirect('/onboarding')
  }

  // Fetch all projects in the organization
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', userProfile.organization_id)
    .order('created_at', { ascending: false })

  // For each project, fetch alert counts
  const projectsWithAlerts = await Promise.all(
    (projects || []).map(async (project) => {
      const { count: alertCount } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id)
        .eq('is_resolved', false)

      return {
        ...project,
        unresolvedAlerts: alertCount || 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Projects
          </h1>
          <p className="mt-2 text-slate-600">
            Manage all your construction projects
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      {/* Projects Grid */}
      {projectsWithAlerts.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Plus className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No projects yet
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Get started by creating your first project
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectsWithAlerts.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

