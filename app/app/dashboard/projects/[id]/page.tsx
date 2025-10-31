import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign } from 'lucide-react'
import { formatCrores, formatDate } from '@/lib/utils'
import { ProjectTabs } from '@/components/projects/project-tabs'

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
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

  // Fetch project
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('organization_id', userProfile.organization_id)
    .single()

  if (error || !project) {
    notFound()
  }

  // Fetch alerts for this project
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('project_id', project.id)
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {project.name}
            </h1>
            <p className="mt-2 text-slate-600">RERA ID: {project.rera_id}</p>
          </div>
          <Button asChild>
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Project Details Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Project Details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Location</p>
              <p className="font-semibold text-slate-900">{project.state}</p>
            </div>
          </div>

          {project.budget && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Budget</p>
                <p className="font-semibold text-slate-900">
                  {formatCrores(project.budget * 10000000)}
                </p>
              </div>
            </div>
          )}

          {project.start_date && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Start Date</p>
                <p className="font-semibold text-slate-900">
                  {formatDate(project.start_date)}
                </p>
              </div>
            </div>
          )}

          {project.target_completion && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Target Completion</p>
                <p className="font-semibold text-slate-900">
                  {formatDate(project.target_completion)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs (Cost Guard, RERA, Contracts, etc.) */}
      <ProjectTabs project={project} alerts={alerts || []} />
    </div>
  )
}

