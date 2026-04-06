export interface AnimatedGradientOptions {
  colors: string[];
  angle: number;
  isAnimated: boolean;
  animationSpeed: number;
  gradientType?: "background" | "text";
  customCss?: string;
}

export const animatedGradientUtils = {
  // Generate CSS for animated gradient
  generateAnimatedCSS: (options: AnimatedGradientOptions): string => {
    const {
      colors,
      angle,
      isAnimated,
      animationSpeed,
      gradientType = "background",
    } = options;

    const gradientStyle = options.customCss || `linear-gradient(${angle}deg, ${colors.join(", ")})`;

    if (!isAnimated) {
      if (gradientType === "text") {
        return `color: transparent;
background-image: ${gradientStyle};
-webkit-background-clip: text;
background-clip: text;`;
      } else {
        return `background: ${gradientStyle};`;
      }
    }

    const animationDuration = `${4 / animationSpeed}s`;
    const keyframeName = `gradientAnimation${Math.random().toString(36).substr(2, 9)}`;

    if (gradientType === "text") {
      return `
color: transparent;
background-image: ${gradientStyle};
background-size: 400% 400%;
-webkit-background-clip: text;
background-clip: text;
animation: ${keyframeName} ${animationDuration} ease infinite;

@keyframes ${keyframeName} {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}`;
    } else {
      return `
background: ${gradientStyle};
background-size: 400% 400%;
animation: ${keyframeName} ${animationDuration} ease infinite;

@keyframes ${keyframeName} {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}`;
    }
  },

  // Generate Tailwind CSS for animated gradient
  generateAnimatedTailwind: (options: AnimatedGradientOptions): string => {
    const {
      colors,
      angle,
      isAnimated,
      animationSpeed,
      gradientType = "background",
    } = options;

    // Determine gradient direction based on angle
    const getGradientDirection = (angle: number) => {
      const normalizedAngle = ((angle % 360) + 360) % 360;
      if (normalizedAngle >= 315 || normalizedAngle < 45) return "to-r";
      if (normalizedAngle >= 45 && normalizedAngle < 135) return "to-br";
      if (normalizedAngle >= 135 && normalizedAngle < 225) return "to-b";
      if (normalizedAngle >= 225 && normalizedAngle < 315) return "to-bl";
      return "to-r";
    };

    const direction = getGradientDirection(angle);
    const hasMiddleColor = colors.length > 2;

    if (!isAnimated) {
      if (gradientType === "text") {
        return hasMiddleColor
          ? `text-transparent bg-clip-text bg-gradient-${direction} from-[${colors[0]}] via-[${colors[1]}] to-[${colors[colors.length - 1]}]`
          : `text-transparent bg-clip-text bg-gradient-${direction} from-[${colors[0]}] to-[${colors[colors.length - 1]}]`;
      } else {
        return hasMiddleColor
          ? `bg-gradient-${direction} from-[${colors[0]}] via-[${colors[1]}] to-[${colors[colors.length - 1]}]`
          : `bg-gradient-${direction} from-[${colors[0]}] to-[${colors[colors.length - 1]}]`;
      }
    }

    // For animated gradients, use predefined animation classes
    const getAnimationClass = (speed: number) => {
      if (speed <= 0.5) return "animate-gradient-slow";
      if (speed <= 1) return "animate-gradient-normal";
      if (speed <= 2) return "animate-gradient-fast";
      return "animate-gradient-very-fast";
    };

    const animationClass = getAnimationClass(animationSpeed);
    const baseClasses =
      gradientType === "text" ? "text-transparent bg-clip-text" : "";

    const tailwindClasses = `${baseClasses} bg-gradient-${direction} from-[${colors[0]}] ${hasMiddleColor ? `via-[${colors[1]}] ` : ""}to-[${colors[colors.length - 1]}] bg-[length:400%_400%] ${animationClass}`;

    // Include the necessary CSS for animation
    const animationCSS = `
/* Add this CSS to your stylesheet for the animation to work */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-slow {
  animation: gradientShift 8s ease infinite;
}

.animate-gradient-normal {
  animation: gradientShift 4s ease infinite;
}

.animate-gradient-fast {
  animation: gradientShift 2s ease infinite;
}

.animate-gradient-very-fast {
  animation: gradientShift 1.33s ease infinite;
}

/* Tailwind Classes: */
`;

    return isAnimated ? `${animationCSS}${tailwindClasses}` : tailwindClasses;
  },

  // Generate SASS/SCSS for animated gradient
  generateAnimatedSass: (options: AnimatedGradientOptions): string => {
    const {
      colors,
      angle,
      isAnimated,
      animationSpeed,
      gradientType = "background",
    } = options;

    const gradientStyle = options.customCss || `linear-gradient(${angle}deg, ${colors.join(", ")})`;

    if (!isAnimated) {
      if (gradientType === "text") {
        return `// Text gradient using SASS/SCSS
$gradient-colors: (${colors.map((color) => `"${color}"`).join(", ")});
$gradient-angle: ${angle}deg;

color: transparent;
background-image: ${gradientStyle};
-webkit-background-clip: text;
background-clip: text;`;
      } else {
        return `// Background gradient using SASS/SCSS
$gradient-colors: (${colors.map((color) => `"${color}"`).join(", ")});
$gradient-angle: ${angle}deg;

background: ${gradientStyle};`;
      }
    }

    const animationDuration = `${4 / animationSpeed}s`;

    if (gradientType === "text") {
      return `// Animated text gradient using SASS/SCSS
$gradient-colors: (${colors.map((color) => `"${color}"`).join(", ")});
$animation-duration: ${animationDuration};
$gradient-angle: ${angle}deg;

color: transparent;
background-image: ${gradientStyle};
background-size: 400% 400%;
-webkit-background-clip: text;
background-clip: text;
animation: gradientShift $animation-duration ease infinite;

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}`;
    } else {
      return `// Animated background gradient using SASS/SCSS
$gradient-colors: (${colors.map((color) => `"${color}"`).join(", ")});
$animation-duration: ${animationDuration};
$gradient-angle: ${angle}deg;

background: ${gradientStyle};
background-size: 400% 400%;
animation: gradientShift $animation-duration ease infinite;

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}`;
    }
  },

  // Generate Bootstrap CSS for animated gradient
  generateAnimatedBootstrap: (options: AnimatedGradientOptions): string => {
    const {
      colors,
      angle,
      isAnimated,
      animationSpeed,
      gradientType = "background",
    } = options;

    const gradientStyle = options.customCss || `linear-gradient(${angle}deg, ${colors.join(", ")})`;

    if (!isAnimated) {
      if (gradientType === "text") {
        return `/* Bootstrap Text Gradient */
.text-gradient {
  color: transparent;
  background-image: ${gradientStyle};
  -webkit-background-clip: text;
  background-clip: text;
}`;
      } else {
        return `/* Bootstrap Background Gradient */
.bg-gradient {
  background: ${gradientStyle};
}`;
      }
    }

    const animationDuration = `${4 / animationSpeed}s`;

    if (gradientType === "text") {
      return `/* Bootstrap Animated Text Gradient */
.animated-text-gradient {
  color: transparent;
  background-image: ${gradientStyle};
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: gradient-animation ${animationDuration} ease infinite;
}

@keyframes gradient-animation {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}`;
    } else {
      return `/* Bootstrap Animated Background Gradient */
.animated-bg-gradient {
  background: ${gradientStyle};
  background-size: 400% 400%;
  animation: gradient-animation ${animationDuration} ease infinite;
}

@keyframes gradient-animation {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}`;
    }
  },

  // Generate SVG for animated gradient
  generateAnimatedSVG: (options: AnimatedGradientOptions): string => {
    const { colors, isAnimated, animationSpeed } = options;

    const gradientStops = colors
      .map(
        (color, index) =>
          `<stop offset="${(index / (colors.length - 1)) * 100}%" stop-color="${color}"/>`,
      )
      .join("\n    ");

    if (!isAnimated) {
      return `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradientStops}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#gradient)"/>
</svg>
      `;
    }

    const animationDuration = `${4 / animationSpeed}s`;

    return `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradientStops}
      <animateTransform
        attributeName="gradientTransform"
        type="rotate"
        values="0 200 200;360 200 200"
        dur="${animationDuration}"
        repeatCount="indefinite"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#animatedGradient)"/>
</svg>
    `;
  },

  // Generate JSON for animated gradient
  generateAnimatedJSON: (options: AnimatedGradientOptions): string => {
    const {
      colors,
      angle,
      isAnimated,
      animationSpeed,
      gradientType = "background",
    } = options;

    return JSON.stringify(
      {
        type: "linear-gradient",
        gradientType: gradientType,
        angle: angle,
        colors: colors,
        animated: isAnimated,
        animationSpeed: animationSpeed,
        animationDuration: isAnimated ? `${4 / animationSpeed}s` : null,
        css: options.customCss || animatedGradientUtils.generateAnimatedCSS(options),
        tailwind: animatedGradientUtils.generateAnimatedTailwind(options),
      },
      null,
      2,
    );
  },

  // Generate Android XML for animated gradient
  generateAnimatedXML: (options: AnimatedGradientOptions): string => {
    const { colors, angle, isAnimated } = options;

    const androidAngle = (angle + 90) % 360;

    if (!isAnimated) {
      return `<?xml version="1.0" encoding="utf-8"?>
<!-- Android XML gradient drawable -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
  <gradient
    android:type="linear"
    android:angle="${androidAngle}"
    android:startColor="${colors[0]}"
    ${colors.length > 2 ? `android:centerColor="${colors[1]}"` : ""}
    android:endColor="${colors[colors.length - 1]}" />
</shape>`;
    }

    return `<?xml version="1.0" encoding="utf-8"?>
<!-- Animated Android XML gradient drawable -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
  <gradient
    android:type="linear"
    android:angle="${androidAngle}"
    android:startColor="${colors[0]}"
    ${colors.length > 2 ? `android:centerColor="${colors[1]}"` : ""}
    android:endColor="${colors[colors.length - 1]}" />
</shape>

<!-- Note: For animation, use ValueAnimator in your Java/Kotlin code:
ValueAnimator colorAnimation = ValueAnimator.ofArgb(startColor, endColor);
colorAnimation.setDuration(${4000 / options.animationSpeed}); // ${4 / options.animationSpeed}s
colorAnimation.setRepeatCount(ValueAnimator.INFINITE);
colorAnimation.setRepeatMode(ValueAnimator.REVERSE);
colorAnimation.addUpdateListener(animator -> {
    gradientDrawable.setColors(new int[]{(int) animator.getAnimatedValue(), endColor});
});
colorAnimation.start();
-->`;
  },

  // Generate React Native animated gradient
  generateAnimatedReactNative: (options: AnimatedGradientOptions): string => {
    const { colors, angle, isAnimated, animationSpeed } = options;

    if (!isAnimated) {
      return `// React Native LinearGradient component
import LinearGradient from 'react-native-linear-gradient';

<LinearGradient
  colors={[${colors.map((color) => `'${color}'`).join(", ")}]}
  ${angle !== 90 ? `angle={${angle}}` : ""}
  style={styles.gradient}
>
  {/* Your content here */}
</LinearGradient>

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    // Add your custom styles here
  },
});`;
    }

    return `// React Native Animated LinearGradient
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const AnimatedGradient = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: ${4000 / animationSpeed}, // ${4 / animationSpeed}s
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: ${4000 / animationSpeed}, // ${4 / animationSpeed}s
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    startAnimation();
  }, []);

  return (
    <LinearGradient
      colors={[${colors.map((color) => `'${color}'`).join(", ")}]}
      ${angle !== 90 ? `angle={${angle}}` : ""}
      style={styles.gradient}
    >
      {/* Your content here */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});`;
  },

  // Generate Flutter animated gradient
  generateAnimatedFlutter: (options: AnimatedGradientOptions): string => {
    const { colors, isAnimated, animationSpeed } = options;

    if (!isAnimated) {
      return `// Flutter Container with LinearGradient
Container(
  decoration: BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        ${colors.map((color) => `Color(0xFF${color.replace("#", "")})`).join(",\n        ")}
      ],
    ),
  ),
  child: // Your widget here
)`;
    }

    return `// Flutter Animated LinearGradient
class AnimatedGradientContainer extends StatefulWidget {
  @override
  _AnimatedGradientContainerState createState() => _AnimatedGradientContainerState();
}

class _AnimatedGradientContainerState extends State<AnimatedGradientContainer>
    with TickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: ${Math.round(4000 / animationSpeed)}), // ${4 / animationSpeed}s
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                ${colors.map((color) => `Color(0xFF${color.replace("#", "")})`).join(",\n                ")}
              ],
              stops: [
                ${colors.map((_, index) => (index / (colors.length - 1)).toFixed(1)).join(",\n                ")}
              ],
            ),
          ),
          child: // Your widget here
        );
      },
    );
  }
}`;
  },

  // Generate SwiftUI animated gradient
  generateAnimatedSwiftUI: (options: AnimatedGradientOptions): string => {
    const { colors, isAnimated, animationSpeed } = options;

    if (!isAnimated) {
      return `// SwiftUI LinearGradient
LinearGradient(
  gradient: Gradient(colors: [
    ${colors.map((color) => `Color(hex: "${color}")`).join(",\n    ")}
  ]),
  startPoint: .topLeading,
  endPoint: .bottomTrailing
)

// Color extension for hex support
extension Color {
  init(hex: String) {
    let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
    var int: UInt64 = 0
    Scanner(string: hex).scanHexInt64(&int)
    let a, r, g, b: UInt64
    switch hex.count {
    case 3: // RGB (12-bit)
      (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
    case 6: // RGB (24-bit)
      (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
    case 8: // ARGB (32-bit)
      (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
    default:
      (a, r, g, b) = (1, 1, 1, 0)
    }
    self.init(
      .sRGB,
      red: Double(r) / 255,
      green: Double(g) / 255,
      blue: Double(b) / 255,
      opacity: Double(a) / 255
    )
  }
}`;
    }

    return `// SwiftUI Animated LinearGradient
struct AnimatedGradientView: View {
    @State private var animateGradient = false
    
    var body: some View {
        LinearGradient(
            gradient: Gradient(colors: [
                ${colors.map((color) => `Color(hex: "${color}")`).join(",\n                ")}
            ]),
            startPoint: animateGradient ? .topLeading : .bottomTrailing,
            endPoint: animateGradient ? .bottomTrailing : .topLeading
        )
        .onAppear {
            withAnimation(
                Animation.easeInOut(duration: ${4 / animationSpeed})
                    .repeatForever(autoreverses: true)
            ) {
                animateGradient.toggle()
            }
        }
    }
}

// Color extension for hex support
extension Color {
  init(hex: String) {
    let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
    var int: UInt64 = 0
    Scanner(string: hex).scanHexInt64(&int)
    let a, r, g, b: UInt64
    switch hex.count {
    case 3: // RGB (12-bit)
      (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
    case 6: // RGB (24-bit)
      (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
    case 8: // ARGB (32-bit)
      (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
    default:
      (a, r, g, b) = (1, 1, 1, 0)
    }
    self.init(
      .sRGB,
      red: Double(r) / 255,
      green: Double(g) / 255,
      blue: Double(b) / 255,
      opacity: Double(a) / 255
    )
  }
}`;
  },

  // Generate Kotlin animated gradient
  generateAnimatedKotlin: (options: AnimatedGradientOptions): string => {
    const { colors, isAnimated, animationSpeed } = options;

    if (!isAnimated) {
      return `// Kotlin/Android GradientDrawable
val gradientDrawable = GradientDrawable().apply {
    orientation = GradientDrawable.Orientation.TOP_BOTTOM
    colors = intArrayOf(
        ${colors.map((color) => `Color.parseColor("${color}")`).join(",\n        ")}
    )
}

// Apply to view
view.background = gradientDrawable`;
    }

    return `// Kotlin/Android Animated GradientDrawable
class AnimatedGradientHelper(private val view: View) {
    private val gradientDrawable = GradientDrawable().apply {
        orientation = GradientDrawable.Orientation.TOP_BOTTOM
    }
    
    private val colors = intArrayOf(
        ${colors.map((color) => `Color.parseColor("${color}")`).join(",\n        ")}
    )
    
    fun startAnimation() {
        val colorAnimation = ValueAnimator.ofFloat(0f, 1f).apply {
            duration = ${Math.round(4000 / animationSpeed)}L // ${4 / animationSpeed}s
            repeatCount = ValueAnimator.INFINITE
            repeatMode = ValueAnimator.REVERSE
            
            addUpdateListener { animator ->
                val fraction = animator.animatedValue as Float
                val evaluatedColors = colors.map { color ->
                    ColorUtils.blendARGB(color, colors.last(), fraction)
                }.toIntArray()
                
                gradientDrawable.colors = evaluatedColors
                view.background = gradientDrawable
            }
        }
        colorAnimation.start()
    }
}

// Usage:
val animatedGradient = AnimatedGradientHelper(yourView)
animatedGradient.startAnimation()`;
  },

  // Generate Vue.js animated gradient
  generateAnimatedVue: (options: AnimatedGradientOptions): string => {
    const {
      colors,
      angle,
      isAnimated,
      animationSpeed,
      gradientType = "background",
    } = options;
    const gradientStyle = options.customCss || `linear-gradient(${angle}deg, ${colors.join(", ")})`;

    if (!isAnimated) {
      return `<!-- Vue.js with CSS -->
<template>
  <div class="gradient-container">
    <!-- Your content here -->
  </div>
</template>

<style scoped>
.gradient-container {
  background: ${gradientStyle};
  ${
    gradientType === "text"
      ? `
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;`
      : ""
  }
}
</style>`;
    }

    return `<!-- Vue.js with Animated CSS -->
<template>
  <div class="animated-gradient-container">
    <!-- Your content here -->
  </div>
</template>

<style scoped>
.animated-gradient-container {
  background: ${gradientStyle};
  background-size: 400% 400%;
  animation: gradientShift ${4 / animationSpeed}s ease infinite;
  ${
    gradientType === "text"
      ? `
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;`
      : ""
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}
</style>`;
  },

  // Generate Angular animated gradient
  generateAnimatedAngular: (options: AnimatedGradientOptions): string => {
    const {
      colors,
      angle,
      isAnimated,
      animationSpeed,
      gradientType = "background",
    } = options;
    const gradientStyle = options.customCss || `linear-gradient(${angle}deg, ${colors.join(", ")})`;

    if (!isAnimated) {
      return `<!-- Angular with CSS -->
<div class="gradient-container">
  <!-- Your content here -->
</div>

/* Component CSS */
.gradient-container {
  background: ${gradientStyle};
  ${
    gradientType === "text"
      ? `
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;`
      : ""
  }
}`;
    }

    return `<!-- Angular with Animated CSS -->
<div class="animated-gradient-container">
  <!-- Your content here -->
</div>

/* Component CSS */
.animated-gradient-container {
  background: ${gradientStyle};
  background-size: 400% 400%;
  animation: gradientShift ${4 / animationSpeed}s ease infinite;
  ${
    gradientType === "text"
      ? `
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;`
      : ""
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}`;
  },

  // Generate React animated gradient
  generateAnimatedReact: (options: AnimatedGradientOptions): string => {
    const {
      colors,
      angle,
      isAnimated,
      animationSpeed,
      gradientType = "background",
    } = options;
    const gradientStyle = options.customCss || `linear-gradient(${angle}deg, ${colors.join(", ")})`;

    if (!isAnimated) {
      return `// React component with styled-components or CSS-in-JS
const GradientContainer = styled.div\`
  background: ${gradientStyle};
  ${
    gradientType === "text"
      ? `
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;`
      : ""
  }
\`;

// Or with inline styles
const gradientStyle = {
  background: '${gradientStyle}',
  ${
    gradientType === "text"
      ? `
  color: 'transparent',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',`
      : ""
  }
};

<div style={gradientStyle}>
  {/* Your content here */}
</div>`;
    }

    return `// React component with animated gradient
import styled, { keyframes } from 'styled-components';

const gradientShift = keyframes\`
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
\`;

const AnimatedGradientContainer = styled.div\`
  background: ${gradientStyle};
  background-size: 400% 400%;
  animation: \${gradientShift} ${4 / animationSpeed}s ease infinite;
  ${
    gradientType === "text"
      ? `
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;`
      : ""
  }
\`;

// Or with CSS modules/inline styles
const animatedGradientStyle = {
  background: '${gradientStyle}',
  backgroundSize: '400% 400%',
  animation: 'gradientShift ${4 / animationSpeed}s ease infinite',
  ${
    gradientType === "text"
      ? `
  color: 'transparent',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',`
      : ""
  }
};

<div style={animatedGradientStyle}>
  {/* Your content here */}
</div>

// Add to your CSS file:
// @keyframes gradientShift {
//   0% { background-position: 0% 50%; }
//   25% { background-position: 100% 50%; }
//   50% { background-position: 100% 100%; }
//   75% { background-position: 0% 100%; }
//   100% { background-position: 0% 50%; }
// }`;
  },

  // Generate Segmented Conic Gradient (Mesh style)
  generateSegmentedConic: (colors: string[], angle: number): string => {
    if (colors.length === 0) return "";
    const step = 360 / colors.length;
    const segments: string[] = [];
    
    for (let i = 0; i < colors.length; i++) {
      const start = i * step + (i === 0 ? 0 : 0.1);
      const end = (i + 1) * step;
      // First stop for this color
      segments.push(`${colors[i]} ${i === 0 ? "0deg" : `calc(${start.toFixed(3)}deg)`}`);
      // Second stop for this color to create edge
      segments.push(`${colors[i]} ${end.toFixed(3)}deg`);
    }
    
    return `conic-gradient(from ${angle}deg, ${segments.join(", ")})`;
  },
};
