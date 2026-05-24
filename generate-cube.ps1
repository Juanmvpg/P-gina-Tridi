$size = 20  # half size is 20, so size is 40
$spacing = 44
$x_offset = 160
$y_offset = 160

function project($x, $y, $z) {
    $px = $x_offset + ($x - $y) * 0.866
    $py = $y_offset + ($x + $y) * 0.5 - $z
    return [Math]::Round($px, 1), [Math]::Round($py, 1)
}

function make_cube_svg($i, $j, $k, $is_floating) {
    $cx = ($i - 0.5) * $spacing
    $cy = ($j - 0.5) * $spacing
    $cz = ($k - 0.5) * $spacing
    
    # 8 vertices
    $h = $size
    $v0 = project ($cx - $h) ($cy - $h) ($cz - $h)
    $v1 = project ($cx + $h) ($cy - $h) ($cz - $h)
    $v2 = project ($cx + $h) ($cy + $h) ($cz - $h)
    $v3 = project ($cx - $h) ($cy + $h) ($cz - $h)
    $v4 = project ($cx - $h) ($cy - $h) ($cz + $h)
    $v5 = project ($cx + $h) ($cy - $h) ($cz + $h)
    $v6 = project ($cx + $h) ($cy + $h) ($cz + $h)
    $v7 = project ($cx - $h) ($cy + $h) ($cz + $h)

    # Faces: Top, Left, Right
    $top_pts = "$($v4[0]),$($v4[1]) $($v5[0]),$($v5[1]) $($v6[0]),$($v6[1]) $($v7[0]),$($v7[1])"
    $left_pts = "$($v3[0]),$($v3[1]) $($v2[0]),$($v2[1]) $($v6[0]),$($v6[1]) $($v7[0]),$($v7[1])"
    $right_pts = "$($v1[0]),$($v1[1]) $($v2[0]),$($v2[1]) $($v6[0]),$($v6[1]) $($v5[0]),$($v5[1])"

    $id = "subcube-${i}-${j}-${k}"
    $class = if ($is_floating) { "floating-piece" } else { "static-piece" }
    
    $svg = @"
  <g id="$id" class="$class">
    <!-- Top Face -->
    <polygon points="$top_pts" fill="url(#grad-top)" stroke="#e04300" stroke-width="0.5" />
    <!-- Left Face -->
    <polygon points="$left_pts" fill="url(#grad-left)" stroke="#b83700" stroke-width="0.5" />
    <!-- Right Face -->
    <polygon points="$right_pts" fill="url(#grad-right)" stroke="#8a2900" stroke-width="0.5" />
  </g>
"@
    return $svg
}

$svg_content = @"
<svg viewBox="0 0 320 320" class="w-full h-full object-contain" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradients for 3D effect -->
    <linearGradient id="grad-top" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff9d70" />
      <stop offset="100%" stop-color="#fc4c00" />
    </linearGradient>
    <linearGradient id="grad-left" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fc4c00" />
      <stop offset="100%" stop-color="#c43b00" />
    </linearGradient>
    <linearGradient id="grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c43b00" />
      <stop offset="100%" stop-color="#8a2900" />
    </linearGradient>
  </defs>
"@

# Draw order: back to front (painter's algorithm)
$cubes = @(
    # @{i=0; j=0; k=0; f=$false} # Excluded to create a clean hollow gap
    @{i=1; j=0; k=0; f=$false}
    @{i=0; j=1; k=0; f=$false}
    @{i=0; j=0; k=1; f=$false}
    @{i=1; j=1; k=0; f=$false}
    @{i=1; j=0; k=1; f=$false}
    @{i=0; j=1; k=1; f=$false}
    @{i=1; j=1; k=1; f=$true} # This is the front-top-right floating piece
)

foreach ($c in $cubes) {
    $svg_content += make_cube_svg $c.i $c.j $c.k $c.f
}

$svg_content += "</svg>"
$svg_content | Out-File -FilePath "cube.svg" -Encoding utf8
Write-Host "Generated cube.svg!"
