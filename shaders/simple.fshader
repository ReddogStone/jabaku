precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vWorldPos;

uniform sampler2D uTexture;
uniform vec3 uPosLight1;
uniform vec3 uColorLight1;
uniform vec3 uPosLight2;
uniform vec3 uColorLight2;
uniform vec4 uColor;

void main() {
	vec4 textureColor = texture2D(uTexture, vTexCoord);
	
	vec3 toLight1 = normalize(uPosLight1 - vWorldPos);
	vec3 toLight2 = normalize(uPosLight2 - vWorldPos);
	vec3 light1 = uColorLight1 * clamp(dot(toLight1, vNormal), 0.0, 1.0);
	vec3 light2 = uColorLight2 * clamp(dot(toLight2, vNormal), 0.0, 1.0);
	
	textureColor.rgb *= (light1 + light2) * uColor.rgb;
	textureColor.rgb += uColor.rgb * uColor.a * textureColor.a;
	
	gl_FragColor = textureColor;
}