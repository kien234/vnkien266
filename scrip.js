document.addEventListener('DOMContentLoaded', function () {
    Swal.fire({
        title: 'Thông Báo',
        html: '<div class="modal-content text-center">' +
            '<div class="modal-header">' +
            '<div class="modal-body">' +
            '<h3 style="text-align: center; color: #ff0000;"><strong>HỆ THỐNG BÁO CÁO VI PHẠM TỚI ĐOÀN TRƯỜNG</strong></h3>' +
            '<p style="margin-bottom: 10px; font-family: Tahoma; font-weight: 400; line-height: 1.1; color: rgb(51, 51, 51); font-size: 18px; text-align: center;">' +
            '<span id="input_part_0" data-mention="Do Momo update 4.0.16 có &quot;Mã tham chiếu = biết trước Mã giao dịch&quot;, nên web sẽ tính bill như sau">' +
            'THPT ĐÔ LƯƠNG 3</span></p>' +
            '<hr>' +
            '<strong>Lưu Ý:</strong><br>' +
            'Hình ảnh và video nên phản ánh rõ vi phạm và tuân thủ quy định về dung lượng.<br>' +
            'Đảm bảo nhập đầy đủ thông tin trước khi gửi để đảm bảo tính chính xác và đầy đủ của báo cáo.<br>' +
            'Nếu có lỗi hoặc vấn đề trong quá trình gửi, kiểm tra lại kết nối internet và thử lại.</p>' +
            '<hr>' +
            '<p style="text-align: left;">' +
            '</div>' +
            '<div class="modal-footer">' +
            '</div></div>',
        showConfirmButton: true, // Ẩn nút xác nhận
        showCloseButton: true,    // Ẩn nút đóng
        allowOutsideClick: true   // Không đóng popup khi bấm ra ngoài
    });
});

function displayFileName(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);

    if (input.files.length > 0) {
        const fileName = input.files[0].name;
        display.textContent = `Selected file: ${fileName}`;
    } else {
        display.textContent = 'Chưa có file nào được chọn';
    }
}

// Thêm hàm resetFileName để reset hiển thị tên file khi không có file nào được chọn
function resetFileName(displayId) {
    const display = document.getElementById(displayId);
    display.textContent = 'Chưa có file nào được chọn';
}

function populateClassOptions() {
    const classSelect = document.getElementById('class');
    const classes = ["Lớp 10D1", "Lớp 10D2", "Lớp 10D3", "Lớp 10D4", "Lớp 10D5", "Lớp 10D6", "Lớp 10D7", "Lớp 10D8", "Lớp 10T1", "Lớp 10T2", "Lớp 10T3", "Lớp 10T4", "Lớp 10T5", "Lớp 10A1", "Lớp 10B", "Lớp 11D1", "Lớp 11D2", "Lớp 11D3", "Lớp 11D4", "Lớp 11D5", "Lớp 11D6", "Lớp 11D7", "Lớp 11T1", "Lớp 11T2", "Lớp 11T3", "Lớp 11T4", "Lớp 11T5", "Lớp 11A1", "Lớp 11B", "Lớp 12D1", "Lớp 12D2", "Lớp 12D3", "Lớp 12D4", "Lớp 12D5", "Lớp 12D6", "Lớp 12D7", "Lớp 12T1", "Lớp 12T2", "Lớp 12T3", "Lớp 12T4", "Lớp 12A1", "Lớp 12B"];

    for (let i = 0; i < classes.length; i++) {
        const option = document.createElement('option');
        option.value = classes[i];
        option.text = classes[i];
        classSelect.appendChild(option);
    }
}

function toggleSenderInfo() {
    const senderType = document.getElementById('senderType');
    const classGroup = document.getElementById('classGroup');
    const teacherNameGroup = document.getElementById('teacherNameGroup');

    if (senderType.value === 'student') {
        classGroup.style.display = 'block';
        teacherNameGroup.style.display = 'none';
    } else if (senderType.value === 'teacher') {
        classGroup.style.display = 'none';
        teacherNameGroup.style.display = 'block';
    }
}

async function submitReport() {
    var videoInput = document.getElementById('videoInput');
    var imageInput = document.getElementById('imageInput');

    if (!imageInput.files.length && !videoInput.files.length) {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo',
            text: 'Bạn cần chọn ít nhất một trong hai tệp ảnh hoặc video.',
        });
        return;
    }

    var reportLimitExceeded = checkReportLimit();
    if (reportLimitExceeded) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Bạn đã vượt quá số lần báo cáo trong một giờ. Vui lòng thử lại sau.',
        });
        return;
    }

    // Lấy giá trị đầu vào từ người dùng
    var fullName = document.getElementById('fullName').value;
    var reportReason = document.getElementById('reportReason').value;
    var senderType = document.getElementById('senderType').value;

    var additionalInfo = '';

    // Thông tin bổ sung dựa trên loại người gửi
    if (senderType === 'student') {
        var selectedClass = document.getElementById('class').value;
        if (!selectedClass) {
            alert('Vui lòng chọn lớp!');
            return;
        }
        additionalInfo = `Người đã gửi Tố Cáo: Học sinh\n\nLớp tố cáo: ${selectedClass}`;
    } else if (senderType === 'teacher') {
        var teacherName = document.getElementById('teacherName').value;
        if (!teacherName) {
            alert('Vui lòng nhập tên của bạn!');
            return;
        }
        additionalInfo = `Người đã gửi Tố Cáo: Giáo viên {phụ huynh}\n\nTên Giáo viên {phụ huynh}: ${teacherName}`;
    }

    // Thông tin bổ sung cho loại người gửi là học sinh
    if (senderType === 'student') {
        var reportedClass = document.getElementById('class2').value;
        if (!reportedClass) {
            alert('Vui lòng chọn lớp có học sinh vi phạm!');
            return;
        }
        additionalInfo += `\n\nLớp có học sinh vi phạm: ${reportedClass}`;
    }

    // Thông tin bổ sung: tên của người bị tố cáo
    additionalInfo += `\nTên người bị tố cáo: ${fullName}`;

    // Lấy và hiển thị địa chỉ IP của người dùng
    var userIP = await getUserIP();

    // Gửi thông điệp cuối cùng
    await sendTelegramMessage(`📢 Có Tố cáo từ📢:\n${additionalInfo}\n\nLý do: ${reportReason}`);
}

function checkReportLimit() {
    // Lấy timestamp hiện tại tính bằng giây
    var currentTimestamp = Math.floor(Date.now() / 1000);

    // Lấy timestamp và đếm từ local storage
    var storedTimestamp = localStorage.getItem('reportTimestamp');
    var storedCount = localStorage.getItem('reportCount');

    // Nếu không có timestamp đã lưu hoặc timestamp đã lưu cách đây hơn một giờ, đặt lại đếm và cập nhật timestamp
    if (!storedTimestamp || currentTimestamp - storedTimestamp > 3600) {
        localStorage.setItem('reportTimestamp', currentTimestamp);
        localStorage.setItem('reportCount', 1);
        return false;
    }

    // Nếu đếm nhỏ hơn giới hạn, tăng đếm và cập nhật timestamp
    if (storedCount < 100) {
        localStorage.setItem('reportCount', parseInt(storedCount) + 1);
        localStorage.setItem('reportTimestamp', currentTimestamp);
        return false;
    }

    // Nếu đếm vượt quá giới hạn, trả về true (đã vượt quá giới hạn báo cáo)
    return true;
}

async function getUserIP() {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error(error);
        return 'N/A';
    }
}

async function sendTelegramMessage(message) {
    var token = '6889088304:AAED5-lcYegRJRP6dPeQiOvLSs0KbxkkyfU';
    var chatId = '6520036650';

    try {
        const now = new Date();
        const dateTimeString = now.toLocaleString();

        // Lấy địa chỉ IP của người gửi
        const userIP = await getUserIP();

        // Thêm địa chỉ IP vào nội dung tin nhắn
        message += `\n\n🌐 **IP người gửi:** ${userIP}`;

        // Kiểm tra và gửi tệp ảnh
        const imageInput = document.getElementById('imageInput');
        if (imageInput.files.length > 0) {
            const imageFile = imageInput.files[0];
            if (!checkFileSize(imageFile, 15)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Dung lượng ảnh quá lớn, vui lòng chọn ảnh có dung lượng dưới 15MB.',
                });
                return;
            }
            await sendMediaFile(chatId, token, 'sendPhoto', imageFile);
        }

        // Kiểm tra và gửi tệp video
        const videoInput = document.getElementById('videoInput');
        if (videoInput.files.length > 0) {
            const videoFile = videoInput.files[0];
            if (!checkFileSize(videoFile, 15)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Dung lượng video quá lớn, vui lòng chọn video có dung lượng dưới 15MB.',
                });
                return;
            }
            await sendMediaFile(chatId, token, 'sendVideo', videoFile);
        }

        // Gửi thông điệp văn bản
        let response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: `${message}\n\n⏰ **Ngày/Giờ Gửi:** ${dateTimeString}`,
                parse_mode: 'Markdown',
            }),
        });

        let data = await response.json();
        console.log(data);

        if (data.ok) {
            // Hiển thị thông báo thành công nếu không có lỗi từ phía Telegram
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Thông tin tố cáo đã được gửi thành công!',
            });
        } else {
            // Hiển thị thông báo lỗi nếu có lỗi từ phía Telegram
            Swal.fire({
                icon: 'error',
                title: 'Lỗi từ Telegram',
                text: 'Đã xảy ra lỗi khi gửi thông tin tố cáo đến Telegram. Vui lòng thử lại sau.',
            });
        }
    } catch (error) {
        console.error(error);

        // Hiển thị thông báo lỗi nếu có lỗi từ phía máy chủ hoặc mạng
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Đã xảy ra lỗi khi gửi thông tin tố cáo. Vui lòng kiểm tra lại kết nối internet và thử lại sau.',
        });
    }
}


function checkFileSize(file, maxSizeInMB) {
    return file.size <= maxSizeInMB * 1024 * 1024;
}

async function sendMediaFile(chatId, token, method, file) {
    try {
        var formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append(method === 'sendPhoto' ? 'photo' : 'video', file);

        Swal.fire({
            title: 'Đang gửi...',
            html: `Đang gửi ${method === 'sendPhoto' ? 'ảnh' : 'video'}: <b>0%</b>`,
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        var percent = Math.round((e.loaded / e.total) * 100);
                        Swal.getContent().querySelector('b').textContent = percent + '%';
                    }
                });

                xhr.onload = function () {
                    if (xhr.status == 200) {
                        Swal.close();
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công!',
                            text: `${method === 'sendPhoto' ? 'Ảnh' : 'Video'} đã được gửi thành công!`,
                        });
                    } else {
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `Đã xảy ra lỗi khi gửi ${method === 'sendPhoto' ? 'ảnh' : 'video'}.`,
                        });
                    }
                };

                xhr.open('POST', `https://api.telegram.org/bot${token}/${method}`, true);
                xhr.send(formData);
            },
        });
    } catch (error) {
        console.error(error);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Đã xảy ra lỗi khi gửi ${method === 'sendPhoto' ? 'ảnh' : 'video'}.`,
        });
    }
}

function resetFile(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    input.value = null; // Đặt giá trị của đầu vào file về null để xóa file đã chọn
    display.textContent = 'Chưa có file nào được chọn';
}
