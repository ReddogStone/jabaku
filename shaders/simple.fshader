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
uniform float uLuminosity;

void main() {
	vec4 textureColor = texture2D(uTexture, vTexCoord);
	
	vec3 toLight1 = normalize(uPosLight1 - vWorldPos);
	vec3 toLight2 = normalize(uPosLight2 - vWorldPos);
	vec3 light1 = uColorLight1 * dot(toLight1, vNormal);
	vec3 light2 = uColorLight2 * dot(toLight2, vNormal);

	textureColor.rgb *= (light1 + light2) * uColor.rgb * uColor.a;
	textureColor.rgb += uColor.rgb * uLuminosity * textureColor.a * uColor.a;
	textureColor.a = uColor.a;
	
	gl_FragColor = textureColor;
}