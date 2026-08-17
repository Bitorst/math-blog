$src = 'd:\Cextender\core-code\math-blog\book'
$dst = 'd:\Cextender\core-code\math-blog\public\books'
New-Item -ItemType Directory -Force -Path $dst | Out-Null

$map = [ordered]@{
  'A Second Course in Complex Analysis (Peter V. Dovbush, Steven G. Krantz) (z-library.sk, 1lib.sk, z-lib.sk).pdf' = 'second-course-complex-analysis.pdf'
  'A term of commutative algebra (Allen Altman, Steven Kleiman) (z-library.sk, 1lib.sk, z-lib.sk).pdf' = 'term-of-commutative-algebra.pdf'
  'AdvCalc24._Folland.pdf' = 'folland-advanced-calculus-notes.pdf'
  'An Introduction to Homological Algebra (Charles A. Weibel) (z-library.sk, 1lib.sk, z-lib.sk).pdf' = 'weibel-intro-homological-algebra.pdf'
  'basic algebra.pdf' = 'basic-algebra.pdf'
  'Fundamentals of Fourier Analysis (Loukas Grafakos) (z-library.sk, 1lib.sk, z-lib.sk).pdf' = 'grafakos-fundamentals-fourier-analysis.pdf'
  'Introduction to Differential Geometry (Joel W. Robbin, Dietmar A. Salamon) (z-library.sk, 1lib.sk, z-lib.sk).pdf' = 'robbin-salamon-differential-geometry.pdf'
  'John_McCleary_A_User''s_Guide_to_Spectral_Sequence.pdf' = 'mccleary-spectral-sequences.pdf'
  'Le Gall_Measure Theory,Probability,and Stochastic Processes.pdf' = 'legall-measure-theory-probability.pdf'
  'Lecture notes on motivic cohomology.pdf' = 'motivic-cohomology-lecture-notes.pdf'
  'lee_smooth_manifolds.pdf' = 'lee-smooth-manifolds.pdf'
  'Paolo Aluffi - Algebra_ Chapter 0.pdf' = 'aluffi-algebra-chapter-0.pdf'
  'Principles of Complex Analysis (Moscow Lectures, 6).pdf' = 'principles-of-complex-analysis.pdf'
  'Probability Theory An Analytic View Second Edition (Daniel W. Stroock) (z-library.sk, 1lib.sk, z-lib.sk).pdf' = 'stroock-probability-analytic-view.pdf'
  'Real Analysis Modern Techniques and Their Applications Second Edition (Gerald B. Folland) (z-library.sk, 1lib.sk, z-lib.sk).pdf' = 'folland-real-analysis.pdf'
  'The K-Book An Introduction to Algebraic K-Theory (Charles A. Weibel) (z-library.sk, 1lib.sk, z-lib.sk).pdf' = 'weibel-k-book.pdf'
  '复变函数 (王晓光) (Z-Library).pdf' = 'fubianhanshu-wangxiaoguang.pdf'
}

foreach ($name in $map.Keys) {
  $from = Join-Path $src $name
  if (-not (Test-Path $from)) {
    Write-Host "MISSING: $name"
    continue
  }
  Copy-Item -LiteralPath $from -Destination (Join-Path $dst $map[$name]) -Force
}

Get-ChildItem $dst | ForEach-Object { "{0}`t{1:N1} MB" -f $_.Name, ($_.Length / 1MB) }
