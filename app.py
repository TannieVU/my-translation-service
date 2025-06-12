# Import các thư viện cần thiết. Flask để tạo web server, os để đọc cài đặt của Heroku.
# request để nhận dữ liệu từ Wix, jsonify để tạo câu trả lời chuẩn API.
import os
from flask import Flask, request, jsonify

# Khởi tạo ứng dụng web
app = Flask(__name__)

# Đây là hàm xử lý chính, nó sẽ chạy khi có ai đó truy cập vào địa chỉ /process
@app.route('/process', methods=['POST'])
def process_text():
    """
    Hàm này nhận một đoạn văn bản từ Wix, xử lý nó, và trả kết quả về.
    """
    try:
        # Lấy dữ liệu JSON mà Wix gửi lên
        input_data = request.json

        # Lấy ra trường 'text' từ dữ liệu đó
        original_text = input_data.get('text')

        # Kiểm tra xem người dùng có gửi text lên không
        if not original_text:
            # Nếu không có text, trả về lỗi
            return jsonify({"error": "Không có dữ liệu văn bản (text) được cung cấp."}), 400

        # --- PHẦN XỬ LÝ CHÍNH NẰM Ở ĐÂY ---
        # Hiện tại, chúng ta sẽ làm một việc đơn giản là thêm chữ "Processed: " vào trước văn bản gốc.
        processed_result = "Processed: " + original_text
        # --- KẾT THÚC PHẦN XỬ LÝ ---

        # Trả về kết quả thành công dưới dạng JSON
        return jsonify({"success": True, "result": processed_result})

    except Exception as e:
        # Nếu có bất kỳ lỗi nào xảy ra trong quá trình xử lý, trả về thông báo lỗi
        print(f"Đã xảy ra lỗi: {e}")
        return jsonify({"success": False, "error": "Đã có lỗi xảy ra trên server."}), 500

# Dòng này để Heroku biết cách chạy ứng dụng
if __name__ == '__main__':
    # Heroku cung cấp một cổng (PORT) động, chúng ta cần đọc nó từ biến môi trường
    port = int(os.environ.get("PORT", 5000))
    # Chạy server, lắng nghe ở tất cả các địa chỉ IP trên cổng được chỉ định
    app.run(host='0.0.0.0', port=port)
