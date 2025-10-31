'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Project {
  id: string;
  name: string;
  rera_id: string;
  location: string;
}

export function ProjectSwitcher() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, rera_id, location')
        .order('name');

      if (error) throw error;

      setProjects(data || []);
      
      // Set first project as default if none selected
      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
        // Store in localStorage
        localStorage.setItem('selectedProjectId', data[0].id);
      } else {
        // Try to restore from localStorage
        const savedProjectId = localStorage.getItem('selectedProjectId');
        if (savedProjectId) {
          const saved = data?.find(p => p.id === savedProjectId);
          if (saved) setSelectedProject(saved);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectProject(project: Project) {
    setSelectedProject(project);
    localStorage.setItem('selectedProjectId', project.id);
    setOpen(false);
    
    // Trigger page refresh to load project-specific data
    window.dispatchEvent(new CustomEvent('projectChanged', { detail: { projectId: project.id } }));
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2 border rounded-lg">
        <Building2 className="h-4 w-4 text-muted-foreground animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading projects...</span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProject ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Building2 className="h-4 w-4 flex-shrink-0 text-primary" />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-sm font-medium truncate w-full text-left">
                  {selectedProject.name}
                </span>
                <span className="text-xs text-muted-foreground truncate w-full text-left">
                  {selectedProject.location}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Select project...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup heading="Your Projects">
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => handleSelectProject(project)}
                  className="flex items-start gap-2 py-3"
                >
                  <Check
                    className={`mt-1 h-4 w-4 flex-shrink-0 ${
                      selectedProject?.id === project.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-sm truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{project.location}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">RERA: {project.rera_id}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push('/dashboard/projects/new');
                }}
                className="flex items-center gap-2 text-primary"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Project</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

