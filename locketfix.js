/***********************************************
 > Tác giả: VietCongChuas
 > Repo: LocketDiamond
 > Mục đích: Mở khóa Locket Gold cho tất cả API
***********************************************/

// Hàm xử lý lỗi parse JSON
function safeJSONParse(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.log("Lỗi parse JSON:", e);
        return null;
    }
}

// Hàm tạo object subscription giả
function createFakeSubscription(purchaseDate, expireDate) {
    return {
        is_sandbox: false,
        ownership_type: "PURCHASED",
        billing_issues_detected_at: null,
        period_type: "normal",
        expires_date: expireDate || "2099-12-31T23:59:59Z",
        grace_period_expires_date: null,
        unsubscribe_detected_at: null,
        original_purchase_date: purchaseDate || "2026-06-22T00:00:00Z",
        purchase_date: purchaseDate || "2026-06-22T00:00:00Z",
        store: "app_store"
    };
}

// Hàm tạo object entitlement giả
function createFakeEntitlement(purchaseDate, expireDate) {
    return {
        grace_period_expires_date: null,
        purchase_date: purchaseDate || "2026-06-22T00:00:00Z",
        product_identifier: "locket.premium",
        expires_date: expireDate || "2099-12-31T23:59:59Z"
    };
}

// Bắt đầu xử lý
var body = $response.body;
if (!body) {
    console.log("Response body rỗng, bỏ qua.");
    $done({});
}

var obj = safeJSONParse(body);
if (!obj) {
    console.log("Không parse được JSON, bỏ qua.");
    $done({});
}

// ======== XỬ LÝ CHO API /subscribers ======== //
if (obj.subscriber) {
    console.log("Xử lý subscriber...");
    
    // Đảm bảo các key tồn tại
    if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
    if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};
    
    // Fake Gold - dùng nhiều tên entitlement để chắc chắn
    var goldEntitlements = ["Gold", "gold", "premium", "locket_gold"];
    var goldSubscriptions = ["locket.premium", "com.locket.premium", "locket_gold_monthly"];
    
    // Thêm entitlement Gold
    goldEntitlements.forEach(function(key) {
        obj.subscriber.entitlements[key] = createFakeEntitlement();
    });
    
    // Thêm subscription Gold
    goldSubscriptions.forEach(function(key) {
        obj.subscriber.subscriptions[key] = createFakeSubscription();
    });
    
    // Xóa các trường gây lỗi (nếu có)
    if (obj.subscriber.entitlements && obj.subscriber.entitlements._list) {
        delete obj.subscriber.entitlements._list;
    }
    
    // Thêm thông báo thành công
    obj._notice = "Locket Gold by VietCongChuas";
    obj._mod_time = new Date().toISOString();
}

// ======== XỬ LÝ CHO API /offerings ======== //
if (obj.offerings) {
    console.log("Xử lý offerings...");
    
    // Nếu có current offerings, đánh dấu là Gold
    if (obj.offerings.current) {
        obj.offerings.current.identifier = "gold";
        obj.offerings.current.availablePackages = obj.offerings.current.availablePackages || [];
        // Thêm package Gold vào offerings
        obj.offerings.current.availablePackages.push({
            identifier: "gold_monthly",
            platformProductIdentifier: "locket.premium",
            product: {
                identifier: "locket.premium",
                price: 0,
                priceString: "0$",
                currencyCode: "USD",
                localizedPriceString: "Free"
            }
        });
    }
    
    // Thêm offerings Gold mới
    obj.offerings.gold = {
        identifier: "gold",
        availablePackages: [{
            identifier: "gold_monthly",
            platformProductIdentifier: "locket.premium",
            product: {
                identifier: "locket.premium",
                price: 0,
                priceString: "0$",
                currencyCode: "USD",
                localizedPriceString: "Free"
            }
        }]
    };
}

// ======== XỬ LÝ CHO API /receipts ======== //
if (obj.receipt) {
    console.log("Xử lý receipts...");
    obj.receipt.is_active = true;
    obj.receipt.expires_date = "2099-12-31T23:59:59Z";
    obj.receipt.product_identifier = "locket.premium";
}

// ======== XỬ LÝ TRƯỜNG HỢP RESPONSE CHỨA DATA ======== //
if (obj.data && obj.data.subscriber) {
    console.log("Xử lý data.subscriber...");
    if (!obj.data.subscriber.entitlements) obj.data.subscriber.entitlements = {};
    obj.data.subscriber.entitlements["Gold"] = createFakeEntitlement();
}

// ======== XỬ LÝ CHO API /subscribers/.../offerings ======== //
// Nếu response có cả subscriber và offerings
if (obj.subscriber && obj.offerings) {
    console.log("Xử lý response hỗn hợp subscriber + offerings...");
    // Đã xử lý ở trên, chỉ thêm thông báo
    obj._status = "gold_active";
}

// ======== LOG KIỂM TRA ======== //
console.log("Locket Gold đã được kích hoạt bởi VietCongChuas!");
console.log("Entitlements:", Object.keys(obj.subscriber?.entitlements || {}));
console.log("Subscriptions:", Object.keys(obj.subscriber?.subscriptions || {}));

// ======== TRẢ KẾT QUẢ ======== //
var newBody = JSON.stringify(obj);
$done({ body: newBody });
