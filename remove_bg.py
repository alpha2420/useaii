from PIL import Image

def remove_white_bg(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # threshold for white
    for item in datas:
        # If it's pure white, or very close (e.g. >= 240, 240, 240)
        if item[0] >= 240 and item[1] >= 240 and item[2] >= 240:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(out_path, "PNG")

remove_white_bg("/Users/shikharsingh/Desktop/support-ai/public/platform_illustration.png", "/Users/shikharsingh/Desktop/support-ai/public/platform_illustration.png")
print("Done")
