precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vWorldPos;
varying vec4 vColor;
varying vec3 vLumDiffSpec;

uniform sampler2D uTexture;
uniform sampler2D uDepthTexture;
uniform vec3 uPosCamera;
uniform vec3 uPosLight1;
uniform vec3 uColorLight1;
uniform vec3 uPosLight2;
uniform vec3 uColorLight2;
uniform vec3 uAmbient;

void main() {
	float layerDepth = texture2D(uDepthTexture, gl_FragCoord.xy / vec2(1024, 768)).r;
	float myDepth = 0.99999 * gl_FragCoord.z;
	if (myDepth < layerDepth) {
		discard;
	}

	vec3 normal = normalize(vNormal);
	vec4 textureColor = texture2D(uTexture, vTexCoord);

	vec3 toLight1 = normalize(uPosLight1 - vWorldPos);
	vec3 toLight2 = normalize(uPosLight2 - vWorldPos);
	vec3 diffuse1 = uColorLight1 * abs(dot(toLight1, normal));
	vec3 diffuse2 = uColorLight2 * abs(dot(toLight2, normal));

	vec3 fromCamera = normalize(vWorldPos - uPosCamera);
	vec3 reflected1 = reflect(toLight1, normal);
	vec3 reflected2 = reflect(toLight2, normal);

	float specular1 = pow(max(dot(reflected1, fromCamera), 0.0), 15.0);
	float specular2 = pow(max(dot(reflected2, fromCamera), 0.0), 15.0);
	vec3 white = vec3(1.0, 1.0, 1.0);

	vec3 diffuse = vLumDiffSpec.y * (diffuse1 + diffuse2) * vColor.rgb;
	vec3 specular = vLumDiffSpec.z * (specular1/* + specular2*/) * mix(white, vColor.rgb, 0.3);
	vec3 ambient = uAmbient * vColor.rgb;

	textureColor.rgb *= (specular + diffuse + ambient) * vColor.a;
	textureColor.rgb += vColor.rgb * vLumDiffSpec.x * textureColor.a * vColor.a;
	textureColor.a *= vColor.a;

	gl_FragColor = textureColor;
}