varying float intensity;

in vec3 N;
in vec3 v;
void main()
{

	// The scene's ambient light.
    vec4 ambient = gl_LightModel.ambient * gl_FrontMaterial.ambient;

	// The normal vectors is generally not normalized after being
	// interpolated across a triangle.  Here we normalize it.
	vec3 Normal = normalize(N);

	// Since the vertex is in eye space, the direction to the
	// viewer is simply the normalized vector from v to the
	// origin.
	vec3 Viewer = -normalize(v);

	// Get the lighting direction and normalize it.
	vec3 Light  = normalize(gl_LightSource[0].position.xyz);

	// Compute halfway vector
	vec3 Half = normalize(Viewer+Light);

	// Compute factor to prevent light leakage from below the
	// surface
	float B = 1.0;
	if(dot(Normal, Light)<0.0) B = 0.0;

	// Compute geometric terms of diffuse and specular
	float diffuseShade = max(dot(Normal, Light), 0.0);

	// Compute product of geometric terms with material and
	// lighting values
	vec4 diffuse = diffuseShade * gl_FrontLightProduct[0].diffuse;
	ambient += gl_FrontLightProduct[0].ambient;

	// add factors from pointlight..
	vec3 PLight = normalize(gl_LightSource[1].position.xyz-v);
	vec3 PHalf = normalize(Viewer+PLight);
	
	vec3 lightDir = gl_LightSource[1].position.xyz - v;
    float distance = length(lightDir);
	
	float PB=1.0;
	if(dot(Normal,normalize(lightDir))<0.0) PB=0.0;
	
	float spotEffect = dot(normalize(gl_LightSource[1].spotDirection), normalize(-lightDir));
    
	if(spotEffect>gl_LightSource[1].spotCosCutoff){
		spotEffect = pow(spotEffect, gl_LightSource[1].spotExponent);

		float atten = spotEffect/(gl_LightSource[1].quadraticAttenuation * distance * distance + 
			gl_LightSource[1].linearAttenuation*distance + gl_LightSource[1].constantAttenuation);
	
		float PdiffuseShade = max(dot(Normal, normalize(lightDir)),0.0);
		diffuse += atten * PdiffuseShade * gl_FrontLightProduct[1].diffuse;
		ambient += atten * gl_FrontLightProduct[1].ambient;
	}
	// Assign final color
	gl_FragColor = ambient + diffuse + gl_FrontMaterial.emission;

	vec4 color;
	if (intensity > 0.95)
		color = vec4(1.0,0.5,0.5,1.0);
	else if (intensity > 0.5)
		color = vec4(0.6,0.3,0.3,1.0);
	else if (intensity > 0.25)
		color = vec4(0.4,0.2,0.2,1.0);
	else
		color = vec4(0.2,0.1,0.1,1.0);
	gl_FragColor = color + gl_FragColor;

}