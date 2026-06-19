export interface PaginationMeta {
  current_page: number
  total_pages: number
  page_count?: number
  total_count: number
}

export interface Jewelry {
  id: number
  type: string | "jewelry"
  company_id: number
  is_shown: boolean
  item_no: string
  description: string
  description_2: string
  center_description: string
  side_description: string
  category: string
  sub_category: string
  model: string
  style: string
  design: string
  gender: string
  size: string
  condition: string | null
  made_in: string
  on_hand: number
  on_memo: number
  on_travel: number
  purchase_quantity: number
  metal_1_type: string
  metal_1_karat: string | null
  metal_1_color: string | null
  metal_1_description: string
  metal_1_tag: string
  metal_1_weight: number
  metal_2_type: string | null
  metal_2_karat: string | null
  metal_2_color: string | null
  metal_2_description: string | null
  metal_2_tag: string | null
  metal_2_weight: number | null
  metal_3_type: string | null
  metal_3_karat: string | null
  metal_3_color: string | null
  metal_3_description: string | null
  metal_3_tag: string | null
  metal_3_weight: number | null
  metal_4_type: string | null
  metal_4_karat: string | null
  metal_4_color: string | null
  metal_4_description: string | null
  metal_4_tag: string | null
  metal_4_weight: number | null
  stone_1_item_no: string | null
  stone_1_description: string | null
  stone_1_tag: string | null
  stone_1_is_center: boolean
  stone_1_carats: number | null
  stone_1_quantity: number | null
  stone_1_shape_code: string | null
  stone_1_clarity_code: string | null
  stone_1_color_code: string | null
  stone_1_type: string | null
  stone_2_item_no: string | null
  stone_2_description: string | null
  stone_2_tag: string | null
  stone_2_is_center: boolean
  stone_2_carats: number | null
  stone_2_quantity: number | null
  stone_2_shape_code: string | null
  stone_2_clarity_code: string | null
  stone_2_color_code: string | null
  stone_2_type: string | null
  stone_3_item_no: string | null
  stone_3_description: string | null
  stone_3_tag: string | null
  stone_3_is_center: boolean
  stone_3_carats: number | null
  stone_3_quantity: number | null
  stone_3_shape_code: string | null
  stone_3_clarity_code: string | null
  stone_3_color_code: string | null
  stone_3_type: string | null
  stone_4_item_no: string | null
  stone_4_description: string | null
  stone_4_tag: string | null
  stone_4_is_center: boolean
  stone_4_carats: number | null
  stone_4_quantity: number | null
  stone_4_shape_code: string | null
  stone_4_clarity_code: string | null
  stone_4_color_code: string | null
  stone_4_type: string | null
  location: string | null
  image_1_filename: string | null
  image_2_filename: string | null
  image_3_filename: string | null
  image_4_filename: string | null
  images: string[] | null
  video_url: string | null
  web_url: string | null
  comment: string | null
  status_on_hand: boolean
  created_at: string
  updated_at: string
  discarded_at: string | null
  discount: number | null
  price_total: number | null
  is_bookmarked: boolean
  url: string
}

export interface JewelryResponse {
  data: Jewelry[]
  meta?: PaginationMeta
}

export interface Stone {
  id: number
  type: string | "diamond"
  company_id: number
  jewelry_id: null
  is_shown: true
  item_no: string
  jewelry_item_no: null
  description: null
  description_2: null
  stone_type: string
  shape_code: string
  shape_name: string
  carats: string
  on_hand_carats: string
  on_memo_carats: string
  on_travel_carats: string
  inventory_type: string
  stones: number
  on_hand_stones: number
  on_memo_stones: number
  on_travel_stones: number
  color_code: string
  clarity_code: string
  cut_code: null
  polish_code: string
  symmetry_code: string
  fluorescence_code: string
  measurements: string
  measurement_width: string
  measurement_length: string
  measurement_height: string
  ratio: string
  depth: number
  table: number
  size: null
  culet: string
  girdle: string
  girdle_thin: string
  girdle_thick: string
  girdle_percentage: null
  crown_angle: null
  crown_height: null
  pavilion_angle: null
  pavilion_depth: null
  overall_make: null
  is_fancy: false
  fancy_color_name: null
  fancy_intensity: null
  fancy_overtone: null
  inclusion_black: null
  inclusion_center: null
  lab_name: string
  lab_cert_no: string
  lab_comments: string
  rap_price: string
  origin: null
  location: null
  company_city: null
  company_state: null
  company_country: string
  image_1_filename: string
  image_2_filename: string | null
  image_3_filename: string | null
  image_4_filename: string | null
  certificate_1_filename: string
  video_url: string | null
  web_url: string | null
  member_comments: string | null
  remarks: string | null
  created_at: string
  updated_at: string
  discarded_at: null
  certificate_url: string
  stone_type_human: string
  discount: null
  price_per_carat: null
  price_total: null
  images: string[]
  certificates: string[]
  is_bookmarked: boolean
  url: string
}

export interface StoneResponse {
  data: Stone[]
  meta?: PaginationMeta
}

export interface Quote {
  id: number
  identifier: string
  user_id: number
  company_id: number
  status: string
  company_notes: string | null
  customer_notes: string
  created_at: string
  updated_at: string
  url: string
  user: {
    id: number
    full_name: string
  }
  files: string[]
  quote_items_count: number
}

export interface QuoteResponse {
  data: Quote[]
  meta?: PaginationMeta
}

export type BookmarkItem = {
  id: number
  user_id: number
  created_at: string
  updated_at: string
  url: string
} & (
  | { type: "Stone"; stone_id: number; jewelry_id: null; item: Stone }
  | { type: "Jewelry"; stone_id: null; jewelry_id: number; item: Jewelry }
)

export interface BookmarkResponse {
  data: BookmarkItem[]
  meta: {
    page_count: number
    total_count: number
  }
}

export type User = {
  id: number
  email: string
  created_at: string
  updated_at: string
  company_id: number
  deactivated: boolean
  role: "owner" | "shopper" | "manager" | "employee" | "client" | "salesperson"
  customer_number: string | null
  price_level_jewelries: string | null
  price_level_stones: string | null
  company_name: string | null
  full_name: string | null
  address_1: string | null
  address_2: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
  phone_1_number: string | null
  phone_1_ext: string | null
  phone_2_number: string | null
  phone_2_ext: string | null
  cell_number: string | null
  fax_number: string | null
  website: string | null
  first_login: boolean
  stripe_user_id: string | null
}

export interface JewelryProperties {
  category: Record<string, string[]>
  design: string[]
  model: string[]
  metal_color: string[]
  metal_karat: string[]
  metal_type: string[]
  size: string[]
  stone_shape: string[]
  stone_type: string[]
  metal_weight_min: number
  metal_weight_max: number
  price_min: number
  price_max: number
}

export interface StoneProperties {
  clarity: string[]
  color: string[]
  cut: string[]
  fluorescence: string[]
  lab: string[]
  polish: string[]
  shape: string[]
  stone_type: string[]
  symmetry: string[]
  carats_max: number
  carats_min: number
  depth_max: number
  depth_min: number
  price_max: number
  price_min: number
  table_max: number
  table_min: number
}
