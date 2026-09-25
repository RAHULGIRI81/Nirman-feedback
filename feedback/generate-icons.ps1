Add-Type -AssemblyName System.Drawing

function Draw-AmritaLogo {
    param(
        [System.Drawing.Graphics]$g,
        [float]$width,
        [float]$height,
        [bool]$isForegroundOnly = $false,
        [bool]$isRound = $false
    )

    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $greenColor = [System.Drawing.ColorTranslator]::FromHtml("#175C36")
    $yellowColor = [System.Drawing.ColorTranslator]::FromHtml("#F2B835")
    $whiteColor = [System.Drawing.ColorTranslator]::FromHtml("#FFFFFF")

    if (-not $isForegroundOnly) {
        $brush = New-Object System.Drawing.SolidBrush($greenColor)
        if ($isRound) {
            $g.FillEllipse($brush, 0, 0, $width, $height)
        } else {
            # Rounded squircle
            $r = $width * 0.22
            $path = New-Object System.Drawing.Drawing2D.GraphicsPath
            $path.AddArc(0, 0, $r * 2, $r * 2, 180, 90)
            $path.AddArc($width - $r * 2, 0, $r * 2, $r * 2, 270, 90)
            $path.AddArc($width - $r * 2, $height - $r * 2, $r * 2, $r * 2, 0, 90)
            $path.AddArc(0, $height - $r * 2, $r * 2, $r * 2, 90, 90)
            $path.CloseFigure()
            $g.FillPath($brush, $path)
            $path.Dispose()
        }
        $brush.Dispose()
    }

    # Relative coordinates based on 100x100 reference grid
    $sx = $width / 100.0
    $sy = $height / 100.0

    # If foreground for adaptive icon (108x108), the content is placed inside central safe zone
    $offsetX = 0.0
    $offsetY = 0.0
    if ($isForegroundOnly) {
        $sx = ($width * 0.72) / 100.0
        $sy = ($height * 0.72) / 100.0
        $offsetX = $width * 0.14
        $offsetY = $height * 0.14
    }

    $whitePen = New-Object System.Drawing.Pen($whiteColor, (3.6 * $sx))
    $whitePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $whitePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $whitePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $yellowPen = New-Object System.Drawing.Pen($yellowColor, (3.6 * $sx))
    $yellowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $yellowPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $yellowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    # 1. Top-Right White Outline Frame (open at bottom-left)
    $framePath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $fr = 6.0 * $sx
    # Frame points: start at (53, 40) -> up to (53, 26) -> arc to (59, 20) -> right to (85, 20) -> arc to (91, 26) -> down to (91, 58) -> arc to (85, 64) -> left to (66, 64)
    $p1 = [System.Drawing.PointF]::new($offsetX + 53 * $sx, $offsetY + 40 * $sy)
    $p2 = [System.Drawing.PointF]::new($offsetX + 53 * $sx, $offsetY + 26 * $sy)
    $framePath.AddLine($p1, $p2)
    $framePath.AddArc($offsetX + (53 * $sx), $offsetY + (20 * $sy), $fr * 2, $fr * 2, 180, 90)
    $framePath.AddLine([System.Drawing.PointF]::new($offsetX + 59 * $sx, $offsetY + 20 * $sy), [System.Drawing.PointF]::new($offsetX + 85 * $sx, $offsetY + 20 * $sy))
    $framePath.AddArc($offsetX + (91 * $sx - $fr * 2), $offsetY + (20 * $sy), $fr * 2, $fr * 2, 270, 90)
    $framePath.AddLine([System.Drawing.PointF]::new($offsetX + 91 * $sx, $offsetY + 26 * $sy), [System.Drawing.PointF]::new($offsetX + 91 * $sx, $offsetY + 58 * $sy))
    $framePath.AddArc($offsetX + (91 * $sx - $fr * 2), $offsetY + (64 * $sy - $fr * 2), $fr * 2, $fr * 2, 0, 90)
    $framePath.AddLine([System.Drawing.PointF]::new($offsetX + 85 * $sx, $offsetY + 64 * $sy), [System.Drawing.PointF]::new($offsetX + 66 * $sx, $offsetY + 64 * $sy))

    $g.DrawPath($whitePen, $framePath)
    $framePath.Dispose()

    # 2. Connecting Lines
    # Base horizontal white line: (17, 72) to (57, 72)
    $g.DrawLine($whitePen, ($offsetX + 17 * $sx), ($offsetY + 72 * $sy), ($offsetX + 57 * $sx), ($offsetY + 72 * $sy))
    # Left diagonal white line: (17, 72) to (43, 39)
    $g.DrawLine($whitePen, ($offsetX + 17 * $sx), ($offsetY + 72 * $sy), ($offsetX + 43 * $sx), ($offsetY + 39 * $sy))
    # Yellow diagonal line: (25, 52) to (57, 72)
    $g.DrawLine($yellowPen, ($offsetX + 25 * $sx), ($offsetY + 52 * $sy), ($offsetX + 57 * $sx), ($offsetY + 72 * $sy))
    # Yellow branch line: (43, 39) to (61, 54.5)
    $g.DrawLine($yellowPen, ($offsetX + 43 * $sx), ($offsetY + 39 * $sy), ($offsetX + 61 * $sx), ($offsetY + 54.5 * $sy))

    # 3. Circles / Nodes
    $whiteBrush = New-Object System.Drawing.SolidBrush($whiteColor)
    $yellowBrush = New-Object System.Drawing.SolidBrush($yellowColor)

    # Small intersection dot (33, 57)
    $dotR = 2.0 * $sx
    $g.FillEllipse($whiteBrush, [float]($offsetX + 33 * $sx - $dotR), [float]($offsetY + 57 * $sy - $dotR), [float]($dotR * 2), [float]($dotR * 2))

    # Node 1: Bottom-Left (White) at (17, 72)
    $nR1 = 5.0 * $sx
    $g.FillEllipse($whiteBrush, [float]($offsetX + 17 * $sx - $nR1), [float]($offsetY + 72 * $sy - $nR1), [float]($nR1 * 2), [float]($nR1 * 2))

    # Node 2: Mid-Left (Yellow) at (25, 52)
    $nR2 = 5.2 * $sx
    $g.FillEllipse($yellowBrush, [float]($offsetX + 25 * $sx - $nR2), [float]($offsetY + 52 * $sy - $nR2), [float]($nR2 * 2), [float]($nR2 * 2))

    # Node 3: Top Peak (Yellow) at (43, 39)
    $nR3 = 5.0 * $sx
    $g.FillEllipse($yellowBrush, [float]($offsetX + 43 * $sx - $nR3), [float]($offsetY + 39 * $sy - $nR3), [float]($nR3 * 2), [float]($nR3 * 2))

    # Node 4: Mid-Right (White) at (61, 54.5)
    $nR4 = 5.0 * $sx
    $g.FillEllipse($whiteBrush, [float]($offsetX + 61 * $sx - $nR4), [float]($offsetY + 54.5 * $sy - $nR4), [float]($nR4 * 2), [float]($nR4 * 2))

    # Node 5: Bottom-Right (Yellow) at (57, 72)
    $nR5 = 5.2 * $sx
    $g.FillEllipse($yellowBrush, [float]($offsetX + 57 * $sx - $nR5), [float]($offsetY + 72 * $sy - $nR5), [float]($nR5 * 2), [float]($nR5 * 2))

    $whitePen.Dispose()
    $yellowPen.Dispose()
    $whiteBrush.Dispose()
    $yellowBrush.Dispose()
}

$resDir = "E:\PROJECTS\feedback app nirman\Nirman-feedback\feedback\android\app\src\main\res"

$densities = @(
    @{ name = "mipmap-mdpi"; size = 48; fgSize = 108 },
    @{ name = "mipmap-hdpi"; size = 72; fgSize = 162 },
    @{ name = "mipmap-xhdpi"; size = 96; fgSize = 216 },
    @{ name = "mipmap-xxhdpi"; size = 144; fgSize = 324 },
    @{ name = "mipmap-xxxhdpi"; size = 192; fgSize = 432 }
)

foreach ($d in $densities) {
    $folder = Join-Path $resDir $d.name
    if (-not (Test-Path $folder)) { New-Item -ItemType Directory -Path $folder -Force | Out-Null }

    # 1. Square ic_launcher.png
    $bmp = New-Object System.Drawing.Bitmap($d.size, $d.size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    Draw-AmritaLogo -g $g -width $d.size -height $d.size -isForegroundOnly $false -isRound $false
    $g.Dispose()
    $bmp.Save((Join-Path $folder "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    # 2. Round ic_launcher_round.png
    $bmpRound = New-Object System.Drawing.Bitmap($d.size, $d.size)
    $gRound = [System.Drawing.Graphics]::FromImage($bmpRound)
    Draw-AmritaLogo -g $gRound -width $d.size -height $d.size -isForegroundOnly $false -isRound $true
    $gRound.Dispose()
    $bmpRound.Save((Join-Path $folder "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpRound.Dispose()

    # 3. Foreground ic_launcher_foreground.png
    $bmpFg = New-Object System.Drawing.Bitmap($d.fgSize, $d.fgSize)
    $gFg = [System.Drawing.Graphics]::FromImage($bmpFg)
    Draw-AmritaLogo -g $gFg -width $d.fgSize -height $d.fgSize -isForegroundOnly $true -isRound $false
    $gFg.Dispose()
    $bmpFg.Save((Join-Path $folder "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpFg.Dispose()

    Write-Host "Generated icons for $($d.name)"
}

# Also generate drawable/splash.png
$drawableDir = Join-Path $resDir "drawable"
$splashBmp = New-Object System.Drawing.Bitmap(512, 512)
$gSplash = [System.Drawing.Graphics]::FromImage($splashBmp)
Draw-AmritaLogo -g $gSplash -width 512 -height 512 -isForegroundOnly $false -isRound $false
$gSplash.Dispose()
$splashBmp.Save((Join-Path $drawableDir "splash.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$splashBmp.Dispose()

Write-Host "Generated all Android icons & splash images successfully!"
