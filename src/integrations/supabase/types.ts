export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          password_hash: string
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash: string
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash?: string
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          branch: string
          created_at: string
          customer_id: string
          delivery_address: string
          delivery_date: string | null
          delivery_fee: number
          deposit_amount: number
          end_date: string
          equipment_category: string
          equipment_name: string
          id: string
          payment_reference: string | null
          payment_status: string
          quote_id: string
          rental_days: number
          return_date: string | null
          special_instructions: string | null
          start_date: string
          status: string
          total_cost: number
          updated_at: string
        }
        Insert: {
          branch: string
          created_at?: string
          customer_id: string
          delivery_address: string
          delivery_date?: string | null
          delivery_fee?: number
          deposit_amount: number
          end_date: string
          equipment_category: string
          equipment_name: string
          id?: string
          payment_reference?: string | null
          payment_status?: string
          quote_id: string
          rental_days: number
          return_date?: string | null
          special_instructions?: string | null
          start_date: string
          status?: string
          total_cost: number
          updated_at?: string
        }
        Update: {
          branch?: string
          created_at?: string
          customer_id?: string
          delivery_address?: string
          delivery_date?: string | null
          delivery_fee?: number
          deposit_amount?: number
          end_date?: string
          equipment_category?: string
          equipment_name?: string
          id?: string
          payment_reference?: string | null
          payment_status?: string
          quote_id?: string
          rental_days?: number
          return_date?: string | null
          special_instructions?: string | null
          start_date?: string
          status?: string
          total_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_users: {
        Row: {
          address_latitude: number | null
          address_longitude: number | null
          created_at: string
          delivery_address: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string
          total_bookings: number
          updated_at: string
        }
        Insert: {
          address_latitude?: number | null
          address_longitude?: number | null
          created_at?: string
          delivery_address: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          phone: string
          total_bookings?: number
          updated_at?: string
        }
        Update: {
          address_latitude?: number | null
          address_longitude?: number | null
          created_at?: string
          delivery_address?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string
          total_bookings?: number
          updated_at?: string
        }
        Relationships: []
      }
      equipment_categories: {
        Row: {
          created_at: string
          delivery: Json
          id: string
          name: string
          pricing: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery?: Json
          id: string
          name: string
          pricing?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery?: Json
          id?: string
          name?: string
          pricing?: Json
          updated_at?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          branch: string
          category: string
          condition: string
          created_at: string
          id: string
          last_checked: string | null
          name: string
          notes: string | null
          purchase_date: string | null
          serial_number: string
          status: string
          updated_at: string
        }
        Insert: {
          branch: string
          category: string
          condition?: string
          created_at?: string
          id: string
          last_checked?: string | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          serial_number: string
          status?: string
          updated_at?: string
        }
        Update: {
          branch?: string
          category?: string
          condition?: string
          created_at?: string
          id?: string
          last_checked?: string | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_otp_valid: {
        Args: { created_at: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
