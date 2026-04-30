import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/database";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

async function main() {
  console.log("Seeding database...");

  const { data: admin } = await supabase
    .from("users")
    .upsert({ email: "admin@coffeeshop.com", name: "관리자", role: "SUPER_ADMIN" }, { onConflict: "email" })
    .select()
    .single();

  const { data: bluebottle } = await supabase
    .from("shops")
    .upsert({
      name: "블루보틀",
      slug: "bluebottle",
      description: "신선한 원두로 만든 스페셜티 커피",
      address: "서울시 강남구 테헤란로 123",
      phone: "02-1234-5678",
      email: "bluebottle@coffeeshop.com",
      owner_id: admin?.id,
    }, { onConflict: "slug" })
    .select()
    .single();

  await supabase
    .from("shops")
    .upsert({
      name: "스텀프타운",
      slug: "stumptown",
      description: "포틀랜드에서 온 정통 핸드드립 커피",
      address: "서울시 마포구 홍대로 456",
      phone: "02-9876-5432",
      email: "stumptown@coffeeshop.com",
      owner_id: admin?.id,
    }, { onConflict: "slug" });

  if (bluebottle) {
    const { data: espresso } = await supabase
      .from("categories")
      .upsert({ name: "에스프레소", slug: "espresso", shop_id: bluebottle.id, sort_order: 1 }, { onConflict: "shop_id,slug" })
      .select()
      .single();

    const { data: filter } = await supabase
      .from("categories")
      .upsert({ name: "필터 커피", slug: "filter", shop_id: bluebottle.id, sort_order: 2 }, { onConflict: "shop_id,slug" })
      .select()
      .single();

    await supabase.from("products").upsert([
      { name: "카페 라떼", slug: "latte", description: "부드러운 우유 거품과 에스프레소의 조화", price: 6500, shop_id: bluebottle.id, category_id: espresso?.id, is_available: true, is_featured: true },
      { name: "아메리카노", slug: "americano", description: "깔끔한 에스프레소에 물을 더한 클래식", price: 5500, shop_id: bluebottle.id, category_id: espresso?.id, is_available: true },
      { name: "푸어오버", slug: "pour-over", description: "에티오피아 원두로 핸드드립한 싱글 오리진", price: 8500, shop_id: bluebottle.id, category_id: filter?.id, is_available: true, is_featured: true },
    ], { onConflict: "shop_id,slug" });
  }

  console.log("Seeding complete.");
}

main().catch(console.error);
