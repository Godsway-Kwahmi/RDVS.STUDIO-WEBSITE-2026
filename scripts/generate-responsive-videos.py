import os
import sys
import subprocess
import imageio_ffmpeg

BASE_DIR = r"s:\Dropbox\Dropbox\RDVS-BRANDING\DESIGN\WEBSITE\RDVS.STUDIO-WEBSITE-2026"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

VIDEOS_TO_PROCESS = [
    # (rel_src, rel_mobile_out, rel_desktop_out_if_needed, is_already_portrait)
    ('assets/videos/tower-cascades/tower-cascades.mp4', 'assets/videos/tower-cascades/tower-cascades-mobile.mp4', None, False),
    ('assets/videos/d-e-t-a-i-l-s/details-film.mp4', 'assets/videos/d-e-t-a-i-l-s/details-film-mobile.mp4', None, False),
    ('assets/videos/funko-ridge/funko-terrace.mp4', 'assets/videos/funko-ridge/funko-terrace-mobile.mp4', None, False),
    ('assets/videos/5aap/5aap-progress.mp4', 'assets/videos/5aap/5aap-progress-mobile.mp4', 'assets/videos/5aap/5aap-progress-desktop.mp4', True),
    ('assets/videos/1957/1957-lounge.mp4', 'assets/videos/1957/1957-lounge-mobile.mp4', None, False),
    ('assets/videos/csm-interiors/csm-interiors.mp4', 'assets/videos/csm-interiors/csm-interiors-mobile.mp4', None, False),
    ('assets/videos/1981/1981-film.mp4', 'assets/videos/1981/1981-film-mobile.mp4', None, False),
    ('assets/videos/ceeander/ceeander-motion.mp4', 'assets/videos/ceeander/ceeander-motion-mobile.mp4', None, False),
    ('assets/videos/trumpet-africa-ident/trumpet-africa.mp4', 'assets/videos/trumpet-africa-ident/trumpet-africa-mobile.mp4', None, False),
    ('assets/videos/hfc-tvc/hfc-commercial.mp4', 'assets/videos/hfc-tvc/hfc-commercial-mobile.mp4', None, False),
    ('assets/videos/moty/moty-intro.mp4', 'assets/videos/moty/moty-intro-mobile.mp4', None, False),
    ('assets/videos/viasat1-breakfast-show/viasat1-titles.mp4', 'assets/videos/viasat1-breakfast-show/viasat1-titles-mobile.mp4', None, False),
]

def has_audio_stream(input_file):
    cmd = [FFMPEG, '-i', input_file]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return 'Audio:' in res.stderr

def convert_to_portrait(src_path, dst_path, is_already_portrait=False):
    if os.path.exists(dst_path):
        print(f"[EXISTS PORTRAIT] {dst_path}")
        return

    has_audio = has_audio_stream(src_path)
    
    if is_already_portrait:
        # Scale/pad to 720x1280 (9:16)
        vf = "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2"
    else:
        # Center-crop to 9:16 and scale to 720x1280
        # Use floor to ensure even crop
        vf = "crop='floor(ih*9/16/2)*2':ih:'(iw-floor(ih*9/16/2)*2)/2':0,scale=720:1280"

    cmd = [
        FFMPEG, '-y',
        '-i', src_path,
        '-vf', vf,
        '-c:v', 'libx264',
        '-profile:v', 'main',
        '-level', '4.0',
        '-pix_fmt', 'yuv420p',
        '-crf', '23',
        '-preset', 'fast',
        '-movflags', '+faststart'
    ]
    if has_audio:
        cmd.extend(['-c:a', 'aac', '-b:a', '128k', '-ar', '44100'])
    else:
        cmd.append('-an')
        
    cmd.append(dst_path)
    
    print(f"[CONVERTING PORTRAIT] {src_path} -> {dst_path}...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"[ERROR] Failed to convert {src_path}: {res.stderr[-400:]}")
    else:
        print(f"[SUCCESS PORTRAIT] Created {dst_path} ({os.path.getsize(dst_path)} bytes)")

def convert_to_widescreen(src_path, dst_path):
    if os.path.exists(dst_path):
        print(f"[EXISTS WIDESCREEN] {dst_path}")
        return

    has_audio = has_audio_stream(src_path)
    # Fit portrait into 1280x720 16:9 with subtle blurred backdrop
    # Filter complex: split into background (blurred, scaled 16:9) and foreground (sharp portrait centered)
    filter_complex = (
        "[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,boxblur=20:5[bg];"
        "[0:v]scale=-1:720[fg];"
        "[bg][fg]overlay=(W-w)/2:(H-h)/2[outv]"
    )

    cmd = [
        FFMPEG, '-y',
        '-i', src_path,
        '-filter_complex', filter_complex,
        '-map', '[outv]',
        '-c:v', 'libx264',
        '-profile:v', 'main',
        '-level', '4.0',
        '-pix_fmt', 'yuv420p',
        '-crf', '22',
        '-preset', 'fast',
        '-movflags', '+faststart'
    ]
    if has_audio:
        cmd.extend(['-map', '0:a?', '-c:a', 'aac', '-b:a', '128k'])
    else:
        cmd.append('-an')
        
    cmd.append(dst_path)
    
    print(f"[CONVERTING WIDESCREEN] {src_path} -> {dst_path}...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"[ERROR] Failed to create widescreen {src_path}: {res.stderr[-400:]}")
    else:
        print(f"[SUCCESS WIDESCREEN] Created {dst_path} ({os.path.getsize(dst_path)} bytes)")

def main():
    print("=== Processing Responsive Slide Videos ===")
    for rel_src, rel_mobile, rel_desktop, is_already_portrait in VIDEOS_TO_PROCESS:
        src = os.path.join(BASE_DIR, rel_src.replace('/', os.sep))
        dst_mob = os.path.join(BASE_DIR, rel_mobile.replace('/', os.sep))
        
        if not os.path.exists(src):
            print(f"[MISSING SRC] {src}")
            continue
            
        convert_to_portrait(src, dst_mob, is_already_portrait)
        
        if rel_desktop:
            dst_desk = os.path.join(BASE_DIR, rel_desktop.replace('/', os.sep))
            convert_to_widescreen(src, dst_desk)

if __name__ == '__main__':
    main()
