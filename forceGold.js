/*
 * VietCongChuas - Fake Locket Gold
 * Dùng để hiển thị huy hiệu Gold cục bộ
 * Kết hợp với DNS để giữ trạng thái
 */

let body = $response.body;
if (body) {
  try {
    let obj = JSON.parse(body);

    // Đảm bảo các key tồn tại
    if (!obj.subscriber) obj.subscriber = {};
    if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};
    if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};

    // Fake subscription Gold (giữ nguyên cấu trúc)
    obj.subscriber.subscriptions["locket.premium"] = {
      "is_sandbox": false,
      "ownership_type": "PURCHASED",
      "billing_issues_detected_at": null,
      "period_type": "normal",
      "expires_date": "2099-12-31T23:59:59Z",
      "grace_period_expires_date": null,
      "unsubscribe_detected_at": null,
      "original_purchase_date": "2026-06-22T00:00:00Z", // Sửa thành ngày hiện tại
      "purchase_date": "2026-06-22T00:00:00Z",
      "store": "app_store"
    };

    // Fake entitlement Gold
    obj.subscriber.entitlements["Gold"] = {
      "grace_period_expires_date": null,
      "purchase_date": "2026-06-22T00:00:00Z",
      "product_identifier": "locket.premium",
      "expires_date": "2099-12-31T23:59:59Z"
    };

    // Thông báo của Sếp
    obj.Notice = "Mod by VietCongChuas - Locket Gold Active!";

    body = JSON.stringify(obj);
  } catch (e) {
    console.log("Fake Gold error:", e);
  }
}

$done({ body });
