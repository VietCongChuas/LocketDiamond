/***********************************************
 > Author:  VietCongChuas
 > Repo: LocketDiamond
***********************************************/

// ========= Giữ nguyên mapping của bản gốc (QUAN TRỌNG) ========= //
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold'] // KHÔNG ĐỔI: App Locket tìm key này
};

// ========= Đặt ngày tham gia (CÓ THỂ ĐỔI) ========= //
var specificDate = "2026-06-22T00:00:00Z"; // Sếp có thể đổi thành ngày hiện tại

// ========= Xử lý Response ========= //
try {
  var obj = JSON.parse($response.body);
} catch (e) {
  console.log("Lỗi parse response:", e);
  $done({});
}

// Đảm bảo các key tồn tại
if (!obj.subscriber) obj.subscriber = {};
if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};

// ========= Tạo thông tin gói (GIỮ NGUYÊN CẤU TRÚC) ========= //
var xunn = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-18T01:04:17Z", // GIỮ NGUYÊN: ngày hết hạn dài
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: specificDate, // Chỉ đổi ngày mua
  purchase_date: specificDate,          // Chỉ đổi ngày mua
  store: "app_store"
};

var xunn_entitlement = {
  grace_period_expires_date: null,
  purchase_date: specificDate, // Chỉ đổi ngày mua
  product_identifier: "com.xunn.premium.yearly", // GIỮ NGUYÊN: Locket dùng identifier này
  expires_date: "2099-12-18T01:04:17Z" // GIỮ NGUYÊN
};

// ========= Áp dụng Mapping (GIỮ NGUYÊN LOGIC) ========= //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let entitlementKey = mapping[match][0];
  let subscriptionKey = mapping[match][1];
  obj.subscriber.subscriptions[subscriptionKey] = xunn;
  obj.subscriber.entitlements[entitlementKey] = xunn_entitlement;
} else {
  // Fallback mặc định - GIỮ NGUYÊN tên key
  obj.subscriber.subscriptions["com.hoangvanbao.premium.yearly"] = xunn;
  obj.subscriber.entitlements["Locket"] = xunn_entitlement; // GIỮ NGUYÊN
}

// ========= Thông báo (CÓ THỂ SỬA) ========= //
obj.Notice = "Tạo bởi VietCongChuas";

// ========= Trả kết quả ========= //
$done({ body: JSON.stringify(obj) });
