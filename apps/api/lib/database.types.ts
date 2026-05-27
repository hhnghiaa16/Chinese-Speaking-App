export type Database = {
  public: {
    Tables: {
      hsk_levels: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          vocab_count: number;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          vocab_count?: number;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          vocab_count?: number;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      topics: {
        Row: {
          id: string;
          key: string;
          title_zh: string | null;
          title_vi: string;
          description_vi: string | null;
          emoji: string | null;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          title_zh?: string | null;
          title_vi: string;
          description_vi?: string | null;
          emoji?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          title_zh?: string | null;
          title_vi?: string;
          description_vi?: string | null;
          emoji?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          hsk_level_id: string;
          topic_id: string;
          question_zh: string;
          question_pinyin: string;
          question_vi: string;
          sample_answer_zh: string | null;
          sample_answer_pinyin: string | null;
          sample_answer_vi: string | null;
          hint_vi: string | null;
          difficulty: number;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hsk_level_id: string;
          topic_id: string;
          question_zh: string;
          question_pinyin: string;
          question_vi: string;
          sample_answer_zh?: string | null;
          sample_answer_pinyin?: string | null;
          sample_answer_vi?: string | null;
          hint_vi?: string | null;
          difficulty?: number;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hsk_level_id?: string;
          topic_id?: string;
          question_zh?: string;
          question_pinyin?: string;
          question_vi?: string;
          sample_answer_zh?: string | null;
          sample_answer_pinyin?: string | null;
          sample_answer_vi?: string | null;
          hint_vi?: string | null;
          difficulty?: number;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'questions_hsk_level_id_fkey';
            columns: ['hsk_level_id'];
            isOneToOne: false;
            referencedRelation: 'hsk_levels';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'questions_topic_id_fkey';
            columns: ['topic_id'];
            isOneToOne: false;
            referencedRelation: 'topics';
            referencedColumns: ['id'];
          },
        ];
      };
      practice_sessions: {
        Row: {
          id: string;
          user_id: string | null;
          hsk_level_id: string | null;
          topic_id: string | null;
          total_questions: number;
          answered_questions: number;
          average_score: number | null;
          started_at: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          hsk_level_id?: string | null;
          topic_id?: string | null;
          total_questions?: number;
          answered_questions?: number;
          average_score?: number | null;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          hsk_level_id?: string | null;
          topic_id?: string | null;
          total_questions?: number;
          answered_questions?: number;
          average_score?: number | null;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'practice_sessions_hsk_level_id_fkey';
            columns: ['hsk_level_id'];
            isOneToOne: false;
            referencedRelation: 'hsk_levels';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'practice_sessions_topic_id_fkey';
            columns: ['topic_id'];
            isOneToOne: false;
            referencedRelation: 'topics';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
