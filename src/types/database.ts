
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "admins": {
                  Row: {
                    "user_id": string
                  }
                  Insert: {
                    "user_id": string
                  }
                  Update: {
                    "user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"match_goals": {
                  Row: {
                    "assist_id": string | null,"created_at": string,"id": string,"is_own_goal": boolean,"match_id": string,"minute": number | null,"scorer_id": string
                  }
                  Insert: {
                    "assist_id"?: string | null,"created_at"?: string,"id"?: string,"is_own_goal"?: boolean,"match_id": string,"minute"?: number | null,"scorer_id": string
                  }
                  Update: {
                    "assist_id"?: string | null,"created_at"?: string,"id"?: string,"is_own_goal"?: boolean,"match_id"?: string,"minute"?: number | null,"scorer_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "match_goals_assist_id_fkey"
      columns: ["assist_id"]
isOneToOne: false
      referencedRelation: "player_stats"
      referencedColumns: ["player_id"]
    },{
      foreignKeyName: "match_goals_assist_id_fkey"
      columns: ["assist_id"]
isOneToOne: false
      referencedRelation: "players"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "match_goals_match_id_fkey"
      columns: ["match_id"]
isOneToOne: false
      referencedRelation: "matches"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "match_goals_scorer_id_fkey"
      columns: ["scorer_id"]
isOneToOne: false
      referencedRelation: "player_stats"
      referencedColumns: ["player_id"]
    },{
      foreignKeyName: "match_goals_scorer_id_fkey"
      columns: ["scorer_id"]
isOneToOne: false
      referencedRelation: "players"
      referencedColumns: ["id"]
    }
                  ]
                },"match_lineups": {
                  Row: {
                    "is_starter": boolean,"match_id": string,"player_id": string,"side": string
                  }
                  Insert: {
                    "is_starter"?: boolean,"match_id": string,"player_id": string,"side": string
                  }
                  Update: {
                    "is_starter"?: boolean,"match_id"?: string,"player_id"?: string,"side"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "match_lineups_match_id_fkey"
      columns: ["match_id"]
isOneToOne: false
      referencedRelation: "matches"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "match_lineups_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "player_stats"
      referencedColumns: ["player_id"]
    },{
      foreignKeyName: "match_lineups_player_id_fkey"
      columns: ["player_id"]
isOneToOne: false
      referencedRelation: "players"
      referencedColumns: ["id"]
    }
                  ]
                },"matches": {
                  Row: {
                    "created_at": string,"id": string,"notes": string | null,"played_at": string,"score_a": number | null,"score_b": number | null,"side_a_name": string,"side_b_name": string,"status": string,"venue": string | null
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"notes"?: string | null,"played_at": string,"score_a"?: number | null,"score_b"?: number | null,"side_a_name"?: string,"side_b_name"?: string,"status"?: string,"venue"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"notes"?: string | null,"played_at"?: string,"score_a"?: number | null,"score_b"?: number | null,"side_a_name"?: string,"side_b_name"?: string,"status"?: string,"venue"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"players": {
                  Row: {
                    "created_at": string,"date_of_birth": string | null,"full_name": string,"id": string,"is_active": boolean,"photo_path": string | null,"position": string,"shirt_number": number | null
                  }
                  Insert: {
                    "created_at"?: string,"date_of_birth"?: string | null,"full_name": string,"id"?: string,"is_active"?: boolean,"photo_path"?: string | null,"position": string,"shirt_number"?: number | null
                  }
                  Update: {
                    "created_at"?: string,"date_of_birth"?: string | null,"full_name"?: string,"id"?: string,"is_active"?: boolean,"photo_path"?: string | null,"position"?: string,"shirt_number"?: number | null
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            "player_stats": {
                  Row: {
                    "appearances": number | null,"assists": number | null,"draws": number | null,"goals": number | null,"losses": number | null,"own_goals": number | null,"player_id": string | null,"starts": number | null,"wins": number | null
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Functions: {
            "is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"save_match_lineup":
{ Args: { "p_entries": Json,"p_match_id": string }; Returns: undefined
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        }
} as const
