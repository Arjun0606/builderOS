import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ProjectForm } from '@/components/projects/project-form'

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/dashboard/projects/${project.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Edit Project
        </h1>
        <p className="mt-2 text-slate-600">
          Update project details for {project.name}
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <ProjectForm
          organizationId={userProfile.organization_id}
          initialData={project}
          isEditing
        />
      </div>
    </div>
  )
}

