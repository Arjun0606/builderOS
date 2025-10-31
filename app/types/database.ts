/**
 * Database Types
 * Auto-generated from Supabase schema
 * Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          organization_id: string
          name: string
          rera_id: string
          state: string
          budget: number | null
          start_date: string | null
          target_completion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          rera_id: string
          state: string
          budget?: number | null
          start_date?: string | null
          target_completion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          rera_id?: string
          state?: string
          budget?: number | null
          start_date?: string | null
          target_completion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          organization_id: string
          email: string
          full_name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          email?: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_project_access: {
        Row: {
          user_id: string
          project_id: string
          access_level: string
          created_at: string
        }
        Insert: {
          user_id: string
          project_id: string
          access_level?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          project_id?: string
          access_level?: string
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          organization_id: string
          project_id: string
          supplier: string
          amount: number
          invoice_number: string
          date: string
          category: string | null
          gst_rate: number | null
          tds_rate: number | null
          is_duplicate: boolean
          flagged_by_cost_guard: boolean
          flag_reason: string | null
          confidence_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          project_id: string
          supplier: string
          amount: number
          invoice_number: string
          date: string
          category?: string | null
          gst_rate?: number | null
          tds_rate?: number | null
          is_duplicate?: boolean
          flagged_by_cost_guard?: boolean
          flag_reason?: string | null
          confidence_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          project_id?: string
          supplier?: string
          amount?: number
          invoice_number?: string
          date?: string
          category?: string | null
          gst_rate?: number | null
          tds_rate?: number | null
          is_duplicate?: boolean
          flagged_by_cost_guard?: boolean
          flag_reason?: string | null
          confidence_score?: number | null
          created_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          organization_id: string
          project_id: string
          contract_type: string
          counterparty: string
          file_url: string
          analysis_result: Json | null
          risk_score: number | null
          critical_issues: number
          moderate_issues: number
          low_issues: number
          marked_pdf_url: string | null
          analyzed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          project_id: string
          contract_type: string
          counterparty: string
          file_url: string
          analysis_result?: Json | null
          risk_score?: number | null
          critical_issues?: number
          moderate_issues?: number
          low_issues?: number
          marked_pdf_url?: string | null
          analyzed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          project_id?: string
          contract_type?: string
          counterparty?: string
          file_url?: string
          analysis_result?: Json | null
          risk_score?: number | null
          critical_issues?: number
          moderate_issues?: number
          low_issues?: number
          marked_pdf_url?: string | null
          analyzed_at?: string | null
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          organization_id: string
          project_id: string
          alert_type: string
          severity: string
          title: string
          description: string
          metadata: Json | null
          is_resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          project_id: string
          alert_type: string
          severity: string
          title: string
          description: string
          metadata?: Json | null
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          project_id?: string
          alert_type?: string
          severity?: string
          title?: string
          description?: string
          metadata?: Json | null
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

