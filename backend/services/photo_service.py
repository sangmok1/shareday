from PIL import Image, ImageDraw, ImageFont, ImageColor
import numpy as np
import datetime
import os

def create_gradient_background(width, height, color1, color2):
    """그라데이션 배경 생성"""
    array = np.zeros((height, width, 3), dtype=np.uint8)
    
    # RGB 값 추출
    r1, g1, b1 = color1
    r2, g2, b2 = color2
    
    # 각 행에 대해 그라데이션 계산
    for i in range(height):
        ratio = i / height
        r = int(r1 * (1 - ratio) + r2 * ratio)
        g = int(g1 * (1 - ratio) + g2 * ratio)
        b = int(b1 * (1 - ratio) + b2 * ratio)
        array[i, :] = [r, g, b]
    
    return Image.fromarray(array)

def create_photo_strip(image_paths, background_color_option):
    try:
        # 이미지 로드
        images = [Image.open(img) for img in image_paths]

        # Load bottom image
        bottom_image = Image.open("images/font_bottom.png").convert("RGBA")

        # Resize all images
        resize_width = 400
        resize_height = 230
        images = [img.resize((resize_width, resize_height)) for img in images]
        bottom_image = bottom_image.resize((int(bottom_image.width * 0.4), int(bottom_image.height * 0.4)))

        # Constants
        mm_to_px = lambda mm: int(mm * 3.78)
        horizontal_margin = mm_to_px(3)
        top_margin = mm_to_px(3)
        vertical_margin = mm_to_px(1.5)
        bottom_margin = mm_to_px(40)

        # 그라데이션 색상 정의
        gradient_colors = {
            'gradient1': ((255, 154, 158), (250, 208, 196)),  # 핑크 그라데이션
            'gradient2': ((168, 237, 234), (254, 214, 227)),  # 민트-핑크 그라데이션
            'gradient3': ((94, 231, 223), (180, 144, 202))    # 민트-퍼플 그라데이션
        }

        # 일반 색상 정의
        solid_colors = {
            'turquoise': (95, 158, 160),
            'black': (0, 0, 0),
            'white': (255, 255, 255),
            'pink': (255, 105, 180),
            'purple': (147, 112, 219),
            'blue': (65, 105, 225)
        }

        # Calculate canvas size
        img_width, img_height = images[0].size
        canvas_width = img_width + 2 * horizontal_margin
        canvas_height = len(images) * (img_height + vertical_margin * 2) + bottom_margin + top_margin

        # Create background
        if background_color_option in gradient_colors:
            # 그라데이션 배경 생성
            color1, color2 = gradient_colors[background_color_option]
            canvas = create_gradient_background(canvas_width, canvas_height, color1, color2)
            canvas = canvas.convert('RGBA')
        else:
            # 단색 배경 생성
            background_color = solid_colors.get(background_color_option, (95, 158, 160))
            canvas = Image.new("RGBA", (canvas_width, canvas_height), background_color + (255,))

        # 나머지 코드는 동일...
        for i, img in enumerate(images):
            x_offset = horizontal_margin
            y_offset = top_margin + i * (img_height + 2 * vertical_margin)
            canvas.paste(img.convert("RGBA"), (x_offset, y_offset))

        bottom_x_offset = (canvas_width - bottom_image.width) // 2
        bottom_y_offset = canvas_height - bottom_margin + (bottom_margin - bottom_image.height) // 2
        canvas.paste(bottom_image, (bottom_x_offset, bottom_y_offset), mask=bottom_image)

        try:
            font = ImageFont.truetype("arial.ttf", 100)
        except:
            font = ImageFont.load_default()

        draw = ImageDraw.Draw(canvas)
        date_text = datetime.datetime.now().strftime("%Y.%m.%d")
        date_bbox = draw.textbbox((0, 0), date_text, font=font)
        date_text_width = date_bbox[2] - date_bbox[0]
        date_text_height = date_bbox[3] - date_bbox[1]
        date_x = (canvas_width - date_text_width) // 2
        date_y = canvas_height - date_text_height - mm_to_px(5)

        draw.text((date_x, date_y), date_text, font=font, fill=(0, 0, 0))

        # Save the final image
        output_path = "temp_output.png"
        canvas = canvas.convert("RGB")
        canvas.save(output_path)

        return output_path

    except Exception as e:
        raise Exception(f"이미지 처리 중 에러가 발생했습니다: {str(e)}") 