export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "SUPER_ADMIN" | "SHOP_OWNER" | "SHOP_STAFF" | "CUSTOMER";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      shops: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          banner_url: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          is_active: boolean;
          owner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          is_active?: boolean;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          is_active?: boolean;
          owner_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shops_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          shop_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          shop_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          shop_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean;
          is_featured: boolean;
          sort_order: number;
          shop_id: string;
          category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          shop_id: string;
          category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          shop_id?: string;
          category_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      product_options: {
        Row: {
          id: string;
          name: string;
          values: string[];
          extra_prices: number[];
          is_required: boolean;
          product_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          values: string[];
          extra_prices?: number[];
          is_required?: boolean;
          product_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          values?: string[];
          extra_prices?: number[];
          is_required?: boolean;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      shop_staff: {
        Row: {
          id: string;
          shop_id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          user_id: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          user_id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shop_staff_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shop_staff_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          status: OrderStatus;
          total_amount: number;
          note: string | null;
          shop_id: string;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          status?: OrderStatus;
          total_amount: number;
          note?: string | null;
          shop_id: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          status?: OrderStatus;
          total_amount?: number;
          note?: string | null;
          shop_id?: string;
          user_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: {
          id: string;
          quantity: number;
          unit_price: number;
          selected_options: Json | null;
          order_id: string;
          product_id: string;
        };
        Insert: {
          id?: string;
          quantity: number;
          unit_price: number;
          selected_options?: Json | null;
          order_id: string;
          product_id: string;
        };
        Update: {
          id?: string;
          quantity?: number;
          unit_price?: number;
          selected_options?: Json | null;
          order_id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, { Row: Record<string, unknown>; Relationships: never[] }>;
    Functions: Record<string, { Args: Record<string, unknown> | never; Returns: unknown }>;
    Enums: {
      user_role: "SUPER_ADMIN" | "SHOP_OWNER" | "SHOP_STAFF" | "CUSTOMER";
      order_status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
    };
    CompositeTypes: Record<string, Record<string, unknown>>;
  };
}
