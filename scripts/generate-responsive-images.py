import os
import sys
from PIL import Image

BASE_DIR = r"s:\Dropbox\Dropbox\RDVS-BRANDING\DESIGN\WEBSITE\RDVS.STUDIO-WEBSITE-2026"

def make_portrait_crop(im, target_ratio=9/16):
    """
    Crop and scale image to exact portrait aspect ratio (9:16).
    Takes the central/balanced crop.
    """
    w, h = im.size
    current_ratio = w / h
    
    if current_ratio > target_ratio:
        # Image is wider than 9:16 -> crop left & right
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        right = left + new_w
        box = (left, 0, right, h)
    else:
        # Image is taller than 9:16 -> crop top & bottom (favor upper-center for architecture)
        new_h = int(w / target_ratio)
        top = int((h - new_h) * 0.35)  # 35% from top to favor architectural facade
        bottom = top + new_h
        box = (0, top, w, bottom)
        
    cropped = im.crop(box)
    # Target resolution: max 1080x1920 or proportional
    target_w = 1080
    target_h = int(target_w / target_ratio) # 1920
    # If source is smaller, scale to fit crisp 1080x1920 or retain resolution
    if cropped.size[0] > 1080:
        cropped = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    elif cropped.size[0] < 720:
        # upscale gently or keep
        scale = 1080 / cropped.size[0]
        cropped = cropped.resize((1080, 1920), Image.Resampling.LANCZOS)
    return cropped

def make_widescreen_crop(im, target_ratio=16/9):
    """
    Crop and scale image to exact widescreen aspect ratio (16:9).
    """
    w, h = im.size
    current_ratio = w / h
    
    if current_ratio > target_ratio:
        # Wider than 16:9 -> crop left & right
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        right = left + new_w
        box = (left, 0, right, h)
    else:
        # Taller than 16:9 -> crop top & bottom (favor upper 30% for architectural horizon)
        new_h = int(w / target_ratio)
        top = int((h - new_h) * 0.30)
        bottom = top + new_h
        box = (0, top, w, bottom)
        
    cropped = im.crop(box)
    target_w = 1920
    target_h = 1080
    if cropped.size[0] >= 1920:
        cropped = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    return cropped

# List of all images to generate portrait and desktop versions for
IMAGES_TO_PROCESS = [
    # (relative_path, custom_desktop_path_or_None)
    ('assets/images/hamlet/hamlet-estate.jpg', 'assets/images/hamlet/hamlet-wide-hero.jpg'),
    ('assets/images/dyv/dyv-dawn.jpg', 'assets/images/dyv/dyv-street-wide.jpg'),
    ('assets/images/barham/barham-residence.jpg', None),
    ('assets/images/frontier/frontier-tower.jpg', None),
    ('assets/images/purc/purc-facade.jpg', None),
    ('assets/images/airport-city/airport-city-1.jpg', None),
    ('assets/images/advantage-place/advantage-place-1.jpg', None),
    ('assets/images/adentan-townhouses/adentan-townhouses-1.jpg', None),
    ('assets/images/afg/afg-headquarters.jpg', 'assets/images/afg/afg-reception-wide.jpg'),
    ('assets/images/hubtel/hubtel-executive.jpg', 'assets/images/hubtel/hubtel-wide-hero.jpg'),
    ('assets/images/labeach/la-beach-towers.jpg', None),
    ('assets/images/mtn/mtn-corridor.jpg', None),
    ('assets/images/abl/abl-reception.jpg', None),
    ('assets/images/c25/c25-1.jpg', None),
    ('assets/images/margin/margin-bank.jpg', None),
    ('assets/images/94-laurel/94-laurel-1.jpg', None),
    ('assets/images/onehive/onehive.jpg', None),
    ('assets/images/campions-renderings/campions-renderings-1.jpg', None),
    ('assets/images/aggregate/villa-aggregate.jpg', None),
    ('assets/images/chocolate/chocolate-1.jpg', None),
    ('assets/images/emerge-ident/emerge-ident-1.png', None),
    ('assets/images/elo-tv/elo-tv-1.jpg', None),
    ('assets/images/hot-gossip/hot-gossip-1.jpg', None),
    ('assets/images/hfc-tvc/hfc-tvc-1.jpg', None),
    ('assets/images/cascades/tower-cascades-night.jpg', None),
    ('assets/images/funko-ridge/funko-ridge-1.jpg', None),
    ('assets/images/5aap/5aap-1.jpg', None),
    ('assets/images/1957/1957-1.jpg', 'assets/images/1957/1957-wide-hero.jpg'),
    ('assets/images/1957/1957-interior.jpg', None),
    ('assets/images/ceeander/ceeander-1.jpg', None)
]

def main():
    print("=== Processing Responsive Slide Images ===")
    for rel_path, custom_desktop in IMAGES_TO_PROCESS:
        src_path = os.path.join(BASE_DIR, rel_path.replace('/', os.sep))
        if not os.path.exists(src_path):
            print(f"[MISSING] {src_path}")
            continue
            
        dir_name = os.path.dirname(src_path)
        base_name, ext = os.path.splitext(os.path.basename(src_path))
        
        mobile_path = os.path.join(dir_name, f"{base_name}-mobile.jpg")
        desktop_path = os.path.join(dir_name, f"{base_name}-desktop.jpg")
        
        with Image.open(src_path) as im:
            # 1. Generate Mobile Portrait (9:16)
            if not os.path.exists(mobile_path):
                im_rgb = im.convert('RGB')
                portrait_im = make_portrait_crop(im_rgb, 9/16)
                portrait_im.save(mobile_path, 'JPEG', quality=90, optimize=True)
                print(f"[CREATED MOBILE PORTRAIT] {mobile_path} ({portrait_im.size})")
            else:
                print(f"[EXISTS MOBILE PORTRAIT] {mobile_path}")
                
            # 2. Generate Desktop Widescreen (16:9)
            if custom_desktop and os.path.exists(os.path.join(BASE_DIR, custom_desktop.replace('/', os.sep))):
                custom_full = os.path.join(BASE_DIR, custom_desktop.replace('/', os.sep))
                with Image.open(custom_full) as custom_im:
                    im_rgb = custom_im.convert('RGB')
                    wide_im = make_widescreen_crop(im_rgb, 16/9)
                    wide_im.save(desktop_path, 'JPEG', quality=92, optimize=True)
                    print(f"[CREATED DESKTOP WIDE FROM CUSTOM] {desktop_path} ({wide_im.size})")
            else:
                im_rgb = im.convert('RGB')
                wide_im = make_widescreen_crop(im_rgb, 16/9)
                wide_im.save(desktop_path, 'JPEG', quality=92, optimize=True)
                print(f"[CREATED DESKTOP WIDESCREEN] {desktop_path} ({wide_im.size})")

if __name__ == '__main__':
    main()
