export interface AvocatData {
  id: string;
  nom: string;
  prenom?: string;
  avatar_url?: string;
  bio?: string;
  titre: string;
  genre?: "homme" | "femme";
  specialites?: string[];
  barreau: string;
  wilaya: string;
  ville: string;
  adresse: {
    rue: string;
    quartier?: string;
    ville?: string;
    code_postal: string;
  };
  contact: {
    telephone?: string;
    mobile?: string;
    fax?: string;
    email?: string | null;
    site_web?: string | null;
    linkedin?: string;
  };
  experience: {
    annees: number;
    date_inscription: string;
  };
  consultation_price?: number;
  langues?: string[];
  verified?: boolean;
  rating?: number;
  reviews_count?: number;
  is_claimed?: boolean;
  claimed_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: "homme" | "femme";
  languages: string[];
  phone?: string;
  mobile?: string;
  location?: string;
  user_type: "client" | "lawyer";
  avatar_url?: string;
  verified?: boolean;
  address?: {
    street: string;
    neighborhood?: string;
    city: string;
    postalCode: string;
  };
  created_at?: string;
  updated_at?: string;
  role?: "admin";
}

export interface LawyerProfile {
  id: string;
  bar_number: string;
  experience_years: number;
  specializations: string[];
  wilayas: string[];
  consultation_price: number | null;
  verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Consultation {
  id: string;
  status: "pending" | "answered" | "closed";
  created_at: string;
  client_id: string;
  lawyer_id?: string;
  question?: string;
  response?: string;
  answered_at?: string;
  opened_by_lawyer?: boolean;
  unread_count?: number;
  client: {
    first_name: string;
    last_name: string;
    email: string;
    location: string;
  };
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  type: "client" | "avocat";
  created_at: string;
}

export interface SearchFilters {
  wilaya?: string;
  barreau?: string;
  ville?: string;
  specialite?: string[];
  experience_min?: number;
  verified?: boolean;
  langues?: string;
  genre?: "homme" | "femme";
}

export interface AvocatsDatabase {
  avocats: AvocatData[];
  metadata: {
    total_avocats: number;

    wilayas: Array<{
      nom: string;
      nombre_avocats: number;
      villes: string[];
    }>;

    barreaux: Array<{
      nom: string;
      wilaya: string;
      nombre_avocats: number;
    }>;
    statistiques?: {
      avocats_verifies: number;
      avocats_non_verifies: number;
      pourcentage_verification: number;
      sources_verification: {
        appels_personnels_alger?: number;
        donnees_barreau_officiel_setif?: number;
        verification_internet_oran?: number;
        verification_internet_annaba?: number;
        [key: string]: number | undefined;
      };
      moyenne_experience: number;
      moyenne_rating: number;
      total_reviews: number;
      avocats_avec_rating?: number;
      repartition_ratings?: {
        alger: number;
        oran: number;
        annaba: number;
        setif: number;
        [key: string]: number;
      };
      // ← AJOUTEZ CETTE SECTION
      repartition_genre?: {
        hommes: number;
        femmes: number;
        pourcentage_femmes: number;
      };
      langues_parlees?: {
        [langue: string]: number;
      };
      repartition_barreaux?: {
        [barreau: string]: number;
      };
    };
    date_creation: string;
    date_mise_a_jour?: string;
    version: string;
    source: string;
    notes: string;
  };
}

export interface MultiSelectWithCheckboxesProps {
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  label?: string;
}

// Extension de votre interface existante pour supporter multi-select
export interface ExtendedLawyerSignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  mobile: string;
  barNumber: string;
  wilaya: string[];
  specializations: string[];
  experience: string;
  consultationPrice: string;
  gender: string;
  languages: string[];
  address: {
    street: string;
    neighborhood?: string;
    city: string;
    postalCode: string;
  };
}

export interface MultiSelectWithCheckboxesProps {
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  label?: string;
  placeholderClassName?: string;
  disabled?: boolean;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  mobile?: string;
  location?: string;
  barNumber?: string;
  wilaya?: string;
  specializations?: string;
  experience?: string;
  consultationPrice?: string;
  gender?: string;
  languages?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  postalCode?: string;
  general?: string;
}

export interface Option {
  id?: string;
  value: string;
  label: string;
}

export interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
  placeholderClassName?: string;
  size?: "default" | "large";
}

export interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning";
}

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: "email" | "push";
}

// Interfaces pour la messagerie
export interface Message {
  id: string;
  message: string;
  sender_type: "client" | "lawyer";
  sender_id: string;
  created_at: string;
  is_read: boolean;
  attachment_url?: string | null;
  attachment_type?: string | null;
  attachment_name?: string | null;
  sender: {
    first_name: string;
    last_name: string;
  };
}

// Interface Consultation étendue
export interface Consultation {
  id: string;
  status: "pending" | "answered" | "closed";
  created_at: string;
  client_id: string;
  lawyer_id?: string;
  question?: string;
  response?: string;
  answered_at?: string;
  client: {
    first_name: string;
    last_name: string;
    email: string;
    location: string;
  };
}

export interface ClientConsultation {
  id: string;
  status: "pending" | "answered" | "closed";
  created_at: string;
  lawyer: {
    first_name: string;
    last_name: string;
  };
  unread_count?: number;
}

// Interfaces pour les composants
export interface AvocatCardProps {
  avocat: AvocatData;
  searchParams?: any;
  className?: string;
}

export interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerId: string;
  lawyerName: string;
  onSuccess: () => void;
}

export interface ReviewSectionProps {
  lawyerId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client: {
    first_name: string;
    last_name: string;
  };
}

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type: "success" | "error" | "warning") => void;
}

export interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type: "success" | "error" | "warning") => void;
  onSuccess: (email: string) => void;
}

export interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export interface FeedbackPopupProps {
  onClose: () => void;
}

export interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: any) => void;
  onClearFilters: () => void;
  searchParams?: any;
}

export interface ImageCropModalProps {
  image: string;
  onComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}
