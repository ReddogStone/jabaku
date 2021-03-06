// mesh data
attribute vec2 aPosition;
attribute vec2 aTexCoord;
// instance data
attribute vec3 aEndPoint1;
attribute vec3 aEndPoint2;
attribute vec4 aColor;
attribute float aWidth;
attribute float aPatternIndex;

varying vec2 vTexCoord;
varying vec4 vColor;

uniform mat4 uView;
uniform mat4 uProjection;
uniform vec2 uScreenSize;
uniform float uPatternCount;

void main() {
	mat4 viewProj = uProjection * uView;
	
	vec4 viewEnd1 = uView * vec4(aEndPoint1, 1.0);
	vec4 viewEnd2 = uView * vec4(aEndPoint2, 1.0);

	vec3 realDir = normalize(viewEnd2.xyz - viewEnd1.xyz);
	if (viewEnd1.z > -0.1) {
		viewEnd1.xyz = viewEnd1.xyz + (-0.1 - viewEnd1.z) / (realDir.z + 0.0000001) * realDir;
	}
	if (viewEnd2.z > -0.1) {
		viewEnd2.xyz = viewEnd2.xyz + (-0.1 - viewEnd2.z) / (realDir.z + 0.0000001) * realDir;
	}
	
	vec4 clipEnd1 = uProjection * viewEnd1;
	vec4 clipEnd2 = uProjection * viewEnd2;
	clipEnd1.xy /= clipEnd1.w;
	clipEnd2.xy /= clipEnd2.w;
	vec2 delta = clipEnd2.xy - clipEnd1.xy;
	vec2 dir = normalize(delta);
	vec2 norm = vec2(dir.y, -dir.x);

	float pixelLength = length(delta.xy * uScreenSize);
	float width = 0.5 * aWidth / length(norm.xy * uScreenSize);
	
	vec2 end = mix(clipEnd1.xy, clipEnd2.xy, aPosition.x);
	vec2 pos = end + norm * (aPosition.y * width);
	gl_Position = vec4(pos, 0.0, 1.0);

	float index = aPatternIndex;
	vTexCoord = aTexCoord * vec2(pixelLength / aWidth, 1.0) + vec2(0.0, aPatternIndex / uPatternCount);
	vColor = aColor;
}