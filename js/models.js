// models.js - Contains functions to create 3D models for the game

// Colors for different types of waste and bins
const COLORS = {
    RECYCLABLE: 0x2ecc71, // Green
    NON_RECYCLABLE: 0xe74c3c, // Red
    BLUE_BIN: 0x3498db, // Blue bin for non-recyclable waste
    YELLOW_BIN: 0xf1c40f, // Yellow bin for recyclable waste
    BROWN_BIN: 0x8B4513, // Brown bin for food waste
    FRIDGE: 0xecf0f1, // White for fridge
    CABINET: 0x795548, // Brown for cabinet
};

// Create a simple trash bin model
function createTrashBin() {
    const group = new THREE.Group();
    
    // Main bin body
    const binGeometry = new THREE.BoxGeometry(1.5, 2, 1.5);
    const binMaterial = new THREE.MeshPhongMaterial({ 
        color: COLORS.TRASH_BIN,
        flatShading: true
    });
    const bin = new THREE.Mesh(binGeometry, binMaterial);
    bin.position.y = 1;
    group.add(bin);
    
    // Bin lid
    const lidGeometry = new THREE.BoxGeometry(1.7, 0.2, 1.7);
    const lidMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2980b9,
        flatShading: true
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 2.1;
    group.add(lid);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8);
    const wheelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x34495e,
        flatShading: true
    });
    
    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.rotation.x = Math.PI / 2;
    wheel1.position.set(0.5, 0.2, 0.6);
    group.add(wheel1);
    
    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.rotation.x = Math.PI / 2;
    wheel2.position.set(-0.5, 0.2, 0.6);
    group.add(wheel2);
    
    const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel3.rotation.x = Math.PI / 2;
    wheel3.position.set(0.5, 0.2, -0.6);
    group.add(wheel3);
    
    const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel4.rotation.x = Math.PI / 2;
    wheel4.position.set(-0.5, 0.2, -0.6);
    group.add(wheel4);
    
    // Add eyes to make it more character-like
    const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    // Left eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 1.7, 0.76);
    group.add(leftEye);
    
    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 1.7, 0.76);
    group.add(rightEye);
    
    // Pupils
    const pupilGeometry = new THREE.SphereGeometry(0.07, 8, 8);
    
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.4, 1.7, 0.9);
    group.add(leftPupil);
    
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.4, 1.7, 0.9);
    group.add(rightPupil);
    
    // Mouth (for expressions)
    const mouthGeometry = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI);
    const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.3, 0.76);
    mouth.rotation.x = Math.PI / 2;
    group.add(mouth);
    
    // Add reference to eyes and mouth for animations
    group.leftEye = leftEye;
    group.rightEye = rightEye;
    group.leftPupil = leftPupil;
    group.rightPupil = rightPupil;
    group.mouth = mouth;
    
    return group;
}

// Create recyclable waste items
function createRecyclableItem(type) {
    let geometry, material, mesh;
    
    switch(type) {
        case 'bottle':
            // Plastic bottle
            const bottleGroup = new THREE.Group();
            
            // Bottle body
            geometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0x87CEEB, 
                transparent: true,
                opacity: 0.7,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            bottleGroup.add(mesh);
            
            // Bottle neck
            geometry = new THREE.CylinderGeometry(0.1, 0.2, 0.3, 8);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 0.65;
            bottleGroup.add(mesh);
            
            // Bottle cap
            geometry = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0x2ecc71,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 0.85;
            bottleGroup.add(mesh);
            
            bottleGroup.userData = { type: 'recyclable', binType: 'recyclable', points: 10 };
            return bottleGroup;
            
        case 'can':
            // Aluminum can
            const canGroup = new THREE.Group();
            
            // Can body
            geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.7, 8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xC0C0C0,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            canGroup.add(mesh);
            
            // Can top
            geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xA0A0A0,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 0.375;
            canGroup.add(mesh);
            
            // Can tab
            geometry = new THREE.BoxGeometry(0.1, 0.02, 0.2);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 0.41;
            canGroup.add(mesh);
            
            canGroup.userData = { type: 'recyclable', binType: 'recyclable', points: 15 };
            return canGroup;
            
        case 'paper':
            // Paper/Cardboard
            geometry = new THREE.BoxGeometry(0.8, 0.1, 1);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xD2B48C,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            
            // Add some details to make it look like paper
            const lineGeometry = new THREE.BoxGeometry(0.7, 0.01, 0.02);
            const lineMaterial = new THREE.MeshPhongMaterial({ color: 0xA0522D });
            
            for (let i = 0; i < 5; i++) {
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.position.set(0, 0.06, -0.4 + i * 0.2);
                mesh.add(line);
            }
            
            mesh.userData = { type: 'recyclable', binType: 'recyclable', points: 5 };
            return mesh;
            
        case 'cardboard-box':
            // Cardboard box
            const boxGroup = new THREE.Group();
            
            // Box body
            geometry = new THREE.BoxGeometry(0.8, 0.6, 0.8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xD2B48C,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            boxGroup.add(mesh);
            
            // Box flaps
            const flapGeometry = new THREE.BoxGeometry(0.7, 0.05, 0.3);
            const flapMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xC3A887,
                flatShading: true
            });
            
            const flap1 = new THREE.Mesh(flapGeometry, flapMaterial);
            flap1.position.set(0, 0.3, 0.25);
            flap1.rotation.x = -0.3;
            boxGroup.add(flap1);
            
            const flap2 = new THREE.Mesh(flapGeometry, flapMaterial);
            flap2.position.set(0, 0.3, -0.25);
            flap2.rotation.x = 0.3;
            boxGroup.add(flap2);
            
            boxGroup.userData = { type: 'recyclable', binType: 'recyclable', points: 10 };
            return boxGroup;
            
        case 'glass-jar':
            // Glass jar
            const jarGroup = new THREE.Group();
            
            // Jar body
            geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xE0FFFF,
                transparent: true,
                opacity: 0.5,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            jarGroup.add(mesh);
            
            // Jar lid
            geometry = new THREE.CylinderGeometry(0.32, 0.32, 0.1, 8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0x8B4513,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 0.45;
            jarGroup.add(mesh);
            
            jarGroup.userData = { type: 'recyclable', binType: 'recyclable', points: 15 };
            return jarGroup;
    }
}

// Create non-recyclable waste items
function createNonRecyclableItem(type) {
    let geometry, material, mesh;
    
    switch(type) {
        case 'styrofoam':
            // Styrofoam container
            geometry = new THREE.BoxGeometry(1, 0.3, 0.8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xFFFFFF,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            
            // Add a lid that's slightly open
            const lidGeometry = new THREE.BoxGeometry(1, 0.05, 0.8);
            const lid = new THREE.Mesh(lidGeometry, material);
            lid.position.set(0, 0.2, -0.1);
            lid.rotation.x = -0.3;
            mesh.add(lid);
            
            mesh.userData = { type: 'non-recyclable', binType: 'non-recyclable', points: -10 };
            return mesh;
            
        case 'diaper':
            // Diaper (simplified)
            const diaperGroup = new THREE.Group();
            
            // Main part
            geometry = new THREE.BoxGeometry(0.6, 0.1, 0.8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xFFFFFF,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            diaperGroup.add(mesh);
            
            // Tabs
            geometry = new THREE.BoxGeometry(0.2, 0.05, 0.1);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xDDDDDD,
                flatShading: true
            });
            
            const leftTab = new THREE.Mesh(geometry, material);
            leftTab.position.set(-0.4, 0, 0.2);
            diaperGroup.add(leftTab);
            
            const rightTab = new THREE.Mesh(geometry, material);
            rightTab.position.set(0.4, 0, 0.2);
            diaperGroup.add(rightTab);
            
            diaperGroup.userData = { type: 'non-recyclable', binType: 'non-recyclable', points: -15 };
            return diaperGroup;
            
        case 'food-waste':
            // Food waste
            const foodGroup = new THREE.Group();
            
            // Apple core
            geometry = new THREE.SphereGeometry(0.3, 8, 8);
            material = new THREE.MeshPhongMaterial({ 
                color: 0x8B4513,
                flatShading: true
            });
            mesh = new THREE.Mesh(geometry, material);
            
            // Take a bite out of the apple
            mesh.scale.set(0.8, 1, 0.9);
            foodGroup.add(mesh);
            
            // Add a stem
            geometry = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 4);
            material = new THREE.MeshPhongMaterial({ 
                color: 0x654321,
                flatShading: true
            });
            const stem = new THREE.Mesh(geometry, material);
            stem.position.y = 0.3;
            foodGroup.add(stem);
            
            foodGroup.userData = { type: 'food-waste', binType: 'food-waste', points: -5 };
            return foodGroup;
    }
}

// Create fresh food items
function createFreshFoodItem(type) {
    let geometry, material, mesh;
    
    switch(type) {
        case 'apple':
            // Fresh apple - improved 3D model
            const appleGroup = new THREE.Group();
            
            // Apple body with better geometry
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            
            // Create a more realistic apple texture
            const appleTexture = new THREE.TextureLoader().load('images/apple_texture.jpg');
            
            // Use MeshStandardMaterial for better lighting
            material = new THREE.MeshStandardMaterial({ 
                color: 0xFF0000, // Red apple
                roughness: 0.5,
                metalness: 0.1,
                map: appleTexture || null,
            });
            
            mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            appleGroup.add(mesh);
            
            // Add a small dent at the top
            const dent = new THREE.Mesh(
                new THREE.SphereGeometry(0.15, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0xDD0000 })
            );
            dent.position.set(0, 0.4, 0);
            dent.scale.y = 0.5;
            appleGroup.add(dent);
            
            // Apple stem - more detailed
            geometry = new THREE.CylinderGeometry(0.04, 0.03, 0.3, 8);
            material = new THREE.MeshStandardMaterial({ 
                color: 0x654321,
                roughness: 0.9,
                metalness: 0.1
            });
            const stem = new THREE.Mesh(geometry, material);
            stem.position.y = 0.6;
            stem.rotation.x = 0.2;
            stem.castShadow = true;
            appleGroup.add(stem);
            
            // Apple leaf - more detailed
            const leafShape = new THREE.Shape();
            leafShape.moveTo(0, 0);
            leafShape.bezierCurveTo(0.1, 0.1, 0.3, 0.1, 0.4, 0);
            leafShape.bezierCurveTo(0.3, -0.1, 0.1, -0.1, 0, 0);
            
            const leafGeometry = new THREE.ExtrudeGeometry(leafShape, {
                steps: 1,
                depth: 0.01,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.02,
                bevelSegments: 3
            });
            
            const leafMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x2ecc71,
                roughness: 0.8,
                metalness: 0.1,
                side: THREE.DoubleSide
            });
            
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.set(0.05, 0.65, 0);
            leaf.rotation.set(0.5, 0, 0.3);
            leaf.scale.set(0.5, 0.5, 0.5);
            leaf.castShadow = true;
            appleGroup.add(leaf);
            
            // Scale up the entire apple
            appleGroup.scale.set(1.5, 1.5, 1.5);
            
            appleGroup.userData = { type: 'fresh-food', containerType: 'fresh-food', points: 10 };
            return appleGroup;
            
        case 'banana':
            // Banana - improved 3D model
            const bananaGroup = new THREE.Group();
            
            // Create a curved path for the banana
            const bananaPath = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0.2, 0.3, 0),
                new THREE.Vector3(0.6, 0.4, 0),
                new THREE.Vector3(1.0, 0.3, 0),
                new THREE.Vector3(1.2, 0, 0)
            ]);
            
            // Create a tube geometry along the path
            const bananaGeometry = new THREE.TubeGeometry(
                bananaPath,
                64,        // tubularSegments
                0.15,      // radius
                16,        // radialSegments
                false      // closed
            );
            
            // Create a realistic banana material
            const bananaMaterial = new THREE.MeshStandardMaterial({
                color: 0xFFE135,
                roughness: 0.6,
                metalness: 0.1
            });
            
            const bananaMesh = new THREE.Mesh(bananaGeometry, bananaMaterial);
            bananaMesh.castShadow = true;
            bananaMesh.receiveShadow = true;
            bananaGroup.add(bananaMesh);
            
            // Add dark tips to the banana
            const tip1 = new THREE.Mesh(
                new THREE.ConeGeometry(0.05, 0.2, 8),
                new THREE.MeshStandardMaterial({ color: 0x654321 })
            );
            tip1.position.set(0, 0, 0);
            tip1.rotation.z = Math.PI;
            bananaGroup.add(tip1);
            
            const tip2 = new THREE.Mesh(
                new THREE.ConeGeometry(0.05, 0.1, 8),
                new THREE.MeshStandardMaterial({ color: 0x654321 })
            );
            tip2.position.set(1.2, 0, 0);
            bananaGroup.add(tip2);
            
            // Add some brown spots
            for (let i = 0; i < 5; i++) {
                const spot = new THREE.Mesh(
                    new THREE.CircleGeometry(0.02 + Math.random() * 0.02, 8),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x8B4513,
                        side: THREE.DoubleSide
                    })
                );
                
                // Position the spot randomly on the banana
                const t = Math.random();
                const position = bananaPath.getPoint(t);
                spot.position.copy(position);
                
                // Orient the spot to face outward
                const normal = bananaPath.getTangent(t);
                spot.lookAt(position.clone().add(new THREE.Vector3(0, 1, 0)));
                
                bananaGroup.add(spot);
            }
            
            // Rotate and position the banana
            bananaGroup.rotation.set(0, 0, -Math.PI / 4);
            
            // Scale up the banana
            bananaGroup.scale.set(1.5, 1.5, 1.5);
            
            bananaGroup.userData = { type: 'fresh-food', containerType: 'fresh-food', points: 8 };
            return bananaGroup;
            
        case 'milk':
            // Milk carton - improved 3D model
            const milkGroup = new THREE.Group();
            
            // Carton body
            geometry = new THREE.BoxGeometry(0.8, 1.2, 0.8);
            
            // Create materials for each side of the carton
            const milkMaterials = [
                new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 }), // right
                new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 }), // left
                new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 }), // top
                new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 }), // bottom
                new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 }), // front
                new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 })  // back
            ];
            
            // Create a "Milk" label to the front face
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 256;
            
            // Fill with white
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add blue border
            context.strokeStyle = '#3498db';
            context.lineWidth = 10;
            context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
            
            // Add text
            context.font = 'bold 48px Arial';
            context.fillStyle = '#3498db';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('LAIT', canvas.width / 2, canvas.height / 2);
            context.fillText('FRAIS', canvas.width / 2, canvas.height / 2 + 60);
            
            // Create texture from canvas
            const milkTexture = new THREE.CanvasTexture(canvas);
            milkMaterials[4] = new THREE.MeshStandardMaterial({ 
                map: milkTexture,
                roughness: 0.4
            });
            
            mesh = new THREE.Mesh(geometry, milkMaterials);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            milkGroup.add(mesh);
            
            // Carton top - more detailed
            const topGroup = new THREE.Group();
            
            // Base of the top
            const topBase = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.1, 0.4),
                new THREE.MeshStandardMaterial({ color: 0xDDDDDD })
            );
            topBase.position.y = 0.65;
            topGroup.add(topBase);
            
            // Cap
            const cap = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16),
                new THREE.MeshStandardMaterial({ color: 0x3498db })
            );
            cap.position.y = 0.75;
            topGroup.add(cap);
            
            milkGroup.add(topGroup);
            
            // Scale up the milk carton
            milkGroup.scale.set(1.5, 1.5, 1.5);
            
            milkGroup.userData = { type: 'fresh-food', containerType: 'fresh-food', points: 12 };
            return milkGroup;
    }
}

// Create non-perishable food items
function createNonPerishableItem(type) {
    let geometry, material, mesh;
    
    switch(type) {
        case 'can-food':
            // Canned food - improved 3D model
            const canGroup = new THREE.Group();
            
            // Can body with better geometry
            geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 32);
            material = new THREE.MeshStandardMaterial({ 
                color: 0xC0C0C0,
                metalness: 0.8,
                roughness: 0.2
            });
            mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            canGroup.add(mesh);
            
            // Create a label texture
            const canCanvas = document.createElement('canvas');
            const canContext = canCanvas.getContext('2d');
            canCanvas.width = 512;
            canCanvas.height = 256;
            
            // Fill with green
            canContext.fillStyle = '#27ae60';
            canContext.fillRect(0, 0, canCanvas.width, canCanvas.height);
            
            // Add text
            canContext.font = 'bold 48px Arial';
            canContext.fillStyle = 'white';
            canContext.textAlign = 'center';
            canContext.textBaseline = 'middle';
            canContext.fillText('CONSERVE', canCanvas.width / 2, canCanvas.height / 2);
            
            // Create texture from canvas
            const canTexture = new THREE.CanvasTexture(canCanvas);
            
            // Can label - wrapped around the can
            const labelGeometry = new THREE.CylinderGeometry(0.41, 0.41, 0.5, 32, 1, true);
            const labelMaterial = new THREE.MeshStandardMaterial({ 
                map: canTexture,
                roughness: 0.6,
                metalness: 0.1,
                side: THREE.DoubleSide
            });
            const label = new THREE.Mesh(labelGeometry, labelMaterial);
            label.position.y = 0;
            canGroup.add(label);
            
            // Can top and bottom with ridges
            const topGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
            const topMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xA0A0A0,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const top = new THREE.Mesh(topGeometry, topMaterial);
            top.position.y = 0.425;
            canGroup.add(top);
            
            // Add ridge to top
            const topRidge = new THREE.Mesh(
                new THREE.TorusGeometry(0.38, 0.02, 16, 32),
                topMaterial
            );
            topRidge.position.y = 0.4;
            topRidge.rotation.x = Math.PI / 2;
            canGroup.add(topRidge);
            
            const bottom = new THREE.Mesh(topGeometry, topMaterial);
            bottom.position.y = -0.425;
            canGroup.add(bottom);
            
            // Add ridge to bottom
            const bottomRidge = new THREE.Mesh(
                new THREE.TorusGeometry(0.38, 0.02, 16, 32),
                topMaterial
            );
            bottomRidge.position.y = -0.4;
            bottomRidge.rotation.x = Math.PI / 2;
            canGroup.add(bottomRidge);
            
            // Scale up the can
            canGroup.scale.set(1.5, 1.5, 1.5);
            
            canGroup.userData = { type: 'non-perishable', containerType: 'non-perishable', points: 10 };
            return canGroup;
            
        case 'cereal':
            // Cereal box - improved 3D model
            const cerealGroup = new THREE.Group();
            
            // Box body
            geometry = new THREE.BoxGeometry(0.8, 1.2, 0.4);
            
            // Create materials for each side of the box
            const cerealMaterials = [
                new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.6 }), // right
                new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.6 }), // left
                new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.6 }), // top
                new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.6 }), // bottom
                new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.6 }), // front
                new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.6 })  // back
            ];
            
            // Create a cereal box label
            const cerealCanvas = document.createElement('canvas');
            const cerealContext = cerealCanvas.getContext('2d');
            cerealCanvas.width = 256;
            cerealCanvas.height = 512;
            
            // Fill with orange
            cerealContext.fillStyle = '#f39c12';
            cerealContext.fillRect(0, 0, cerealCanvas.width, cerealCanvas.height);
            
            // Add blue circle
            cerealContext.beginPath();
            cerealContext.arc(cerealCanvas.width / 2, cerealCanvas.height / 3, 80, 0, Math.PI * 2);
            cerealContext.fillStyle = '#3498db';
            cerealContext.fill();
            
            // Add text
            cerealContext.font = 'bold 48px Arial';
            cerealContext.fillStyle = 'white';
            cerealContext.textAlign = 'center';
            cerealContext.textBaseline = 'middle';
            cerealContext.fillText('CÉRÉALES', cerealCanvas.width / 2, cerealCanvas.height / 2);
            cerealContext.fillText('CROUSTILLANTES', cerealCanvas.width / 2, cerealCanvas.height / 2 + 60);
            
            // Create texture from canvas
            const cerealTexture = new THREE.CanvasTexture(cerealCanvas);
            cerealMaterials[4] = new THREE.MeshStandardMaterial({ 
                map: cerealTexture,
                roughness: 0.6
            });
            
            mesh = new THREE.Mesh(geometry, cerealMaterials);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            cerealGroup.add(mesh);
            
            // Scale up the cereal box
            cerealGroup.scale.set(1.5, 1.5, 1.5);
            
            cerealGroup.userData = { type: 'non-perishable', containerType: 'non-perishable', points: 8 };
            return cerealGroup;
            
        case 'pasta':
            // Pasta package - improved 3D model
            const pastaGroup = new THREE.Group();
            
            // Package body
            geometry = new THREE.BoxGeometry(0.7, 1.0, 0.3);
            
            // Create materials for each side of the package
            const pastaMaterials = [
                new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.6 }), // right
                new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.6 }), // left
                new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.6 }), // top
                new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.6 }), // bottom
                new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.6 }), // front
                new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.6 })  // back
            ];
            
            // Create a pasta package label
            const pastaCanvas = document.createElement('canvas');
            const pastaContext = pastaCanvas.getContext('2d');
            pastaCanvas.width = 256;
            pastaCanvas.height = 512;
            
            // Fill with red
            pastaContext.fillStyle = '#e74c3c';
            pastaContext.fillRect(0, 0, pastaCanvas.width, pastaCanvas.height);
            
            // Add window showing pasta
            pastaContext.fillStyle = '#f5f5f5';
            pastaContext.fillRect(30, 100, pastaCanvas.width - 60, 150);
            
            // Draw pasta strands
            pastaContext.strokeStyle = '#f1c40f';
            pastaContext.lineWidth = 3;
            for (let i = 0; i < 10; i++) {
                pastaContext.beginPath();
                pastaContext.moveTo(50 + i * 20, 110);
                pastaContext.bezierCurveTo(
                    50 + i * 20 + 10, 150,
                    50 + i * 20 - 10, 200,
                    50 + i * 20, 240
                );
                pastaContext.stroke();
            }
            
            // Add text
            pastaContext.font = 'bold 48px Arial';
            pastaContext.fillStyle = 'white';
            pastaContext.textAlign = 'center';
            pastaContext.textBaseline = 'middle';
            pastaContext.fillText('PÂTES', pastaCanvas.width / 2, 350);
            pastaContext.font = 'bold 36px Arial';
            pastaContext.fillText('SPAGHETTI', pastaCanvas.width / 2, 400);
            
            // Create texture from canvas
            const pastaTexture = new THREE.CanvasTexture(pastaCanvas);
            pastaMaterials[4] = new THREE.MeshStandardMaterial({ 
                map: pastaTexture,
                roughness: 0.6
            });
            
            mesh = new THREE.Mesh(geometry, pastaMaterials);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            pastaGroup.add(mesh);
            
            // Scale up the pasta package
            pastaGroup.scale.set(1.5, 1.5, 1.5);
            
            pastaGroup.userData = { type: 'non-perishable', containerType: 'non-perishable', points: 7 };
            return pastaGroup;
    }
}

// Create a blue trash bin for non-recyclable waste
function createBlueBin() {
    const group = new THREE.Group();
    
    // Main bin body
    const binGeometry = new THREE.BoxGeometry(1.5, 2, 1.5);
    const binMaterial = new THREE.MeshPhongMaterial({ 
        color: COLORS.BLUE_BIN,
        flatShading: true
    });
    const bin = new THREE.Mesh(binGeometry, binMaterial);
    bin.position.y = 1;
    group.add(bin);
    
    // Bin lid
    const lidGeometry = new THREE.BoxGeometry(1.7, 0.2, 1.7);
    const lidMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2980b9,
        flatShading: true
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 2.1;
    group.add(lid);
    
    // Label
    const labelGeometry = new THREE.PlaneGeometry(1, 0.5);
    const labelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        flatShading: true
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, 1.5, 0.76);
    group.add(label);
    
    // Add text "Non-Recyclable" to the label
    try {
        // Vérifier si la librairie FontLoader est disponible
        if (THREE.FontLoader) {
            // Utiliser un simple sprite texturé au lieu de TextGeometry
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const context = canvas.getContext('2d');
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = 'bold 24px Arial';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('Non-Recyclable', canvas.width / 2, canvas.height / 2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(1.5, 0.4, 1);
            sprite.position.set(0, 1.5, 0.77);
            group.add(sprite);
        } else {
            throw new Error("FontLoader not available");
        }
    } catch (e) {
        console.log("TextGeometry not available, using fallback");
        // Fallback: just add a visual indicator
        const indicatorGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.01);
        const indicatorMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.position.set(0, 1.5, 0.77);
        group.add(indicator);
    }
    
    // Suppression du double indicateur visuel
    // const indicatorGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.01);
    // const indicatorMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    // const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    // indicator.position.set(0, 1.5, 0.77);
    // group.add(indicator);
    
    group.userData = { type: 'bin', binType: 'non-recyclable' };
    return group;
}

// Create a yellow trash bin for recyclable waste
function createYellowBin() {
    const group = new THREE.Group();
    
    // Main bin body
    const binGeometry = new THREE.BoxGeometry(1.5, 2, 1.5);
    const binMaterial = new THREE.MeshPhongMaterial({ 
        color: COLORS.YELLOW_BIN,
        flatShading: true
    });
    const bin = new THREE.Mesh(binGeometry, binMaterial);
    bin.position.y = 1;
    group.add(bin);
    
    // Bin lid
    const lidGeometry = new THREE.BoxGeometry(1.7, 0.2, 1.7);
    const lidMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf39c12,
        flatShading: true
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 2.1;
    group.add(lid);
    
    // Label
    const labelGeometry = new THREE.PlaneGeometry(1, 0.5);
    const labelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        flatShading: true
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, 1.5, 0.76);
    group.add(label);
    
    // Add visual indicator
    const indicatorGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.01);
    const indicatorMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicator.position.set(0, 1.5, 0.77);
    group.add(indicator);
    
    group.userData = { type: 'bin', binType: 'recyclable' };
    return group;
}

// Create a fridge for fresh food
function createFridge() {
    const group = new THREE.Group();
    
    // Fridge body
    const fridgeGeometry = new THREE.BoxGeometry(2, 3.5, 1.5);
    const fridgeMaterial = new THREE.MeshPhongMaterial({ 
        color: COLORS.FRIDGE,
        flatShading: true
    });
    const fridge = new THREE.Mesh(fridgeGeometry, fridgeMaterial);
    fridge.position.y = 1.75;
    group.add(fridge);
    
    // Fridge door handle
    const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const handleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xbdc3c7,
        flatShading: true
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0.8, 2, 0.8);
    group.add(handle);
    
    // Fridge door seal
    const sealGeometry = new THREE.BoxGeometry(2.02, 3.52, 0.05);
    const sealMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xbdc3c7,
        flatShading: true
    });
    const seal = new THREE.Mesh(sealGeometry, sealMaterial);
    seal.position.set(0, 1.75, 0.78);
    group.add(seal);
    
    // Label
    const labelGeometry = new THREE.PlaneGeometry(1.5, 0.5);
    const labelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        flatShading: true
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, 3, 0.8);
    group.add(label);
    
    // Add visual indicator
    const indicatorGeometry = new THREE.BoxGeometry(1, 0.1, 0.01);
    const indicatorMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicator.position.set(0, 3, 0.81);
    group.add(indicator);
    
    group.userData = { type: 'container', containerType: 'fresh-food' };
    return group;
}

// Create a cabinet for non-perishable food
function createCabinet() {
    const group = new THREE.Group();
    
    // Cabinet body
    const cabinetGeometry = new THREE.BoxGeometry(2.5, 2, 1.5);
    const cabinetMaterial = new THREE.MeshPhongMaterial({ 
        color: COLORS.CABINET,
        flatShading: true
    });
    const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
    cabinet.position.y = 1;
    group.add(cabinet);
    
    // Cabinet doors
    const doorGeometry = new THREE.BoxGeometry(1.2, 1.8, 0.1);
    const doorMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8B4513,
        flatShading: true
    });
    
    // Left door
    const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    leftDoor.position.set(-0.6, 1, 0.8);
    group.add(leftDoor);
    
    // Right door
    const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
    rightDoor.position.set(0.6, 1, 0.8);
    group.add(rightDoor);
    
    // Door handles
    const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const handleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xbdc3c7,
        flatShading: true
    });
    
    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.rotation.z = Math.PI / 2;
    leftHandle.position.set(-0.2, 1, 0.9);
    group.add(leftHandle);
    
    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.rotation.z = Math.PI / 2;
    rightHandle.position.set(0.2, 1, 0.9);
    group.add(rightHandle);
    
    // Label
    const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
    const labelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        flatShading: true
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, 1.8, 0.9);
    group.add(label);
    
    // Add visual indicator
    const indicatorGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.01);
    const indicatorMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicator.position.set(0, 1.8, 0.91);
    group.add(indicator);
    
    group.userData = { type: 'container', containerType: 'non-perishable' };
    return group;
}

// Create a brown bin for food waste
function createBrownBin() {
    const group = new THREE.Group();
    
    // Main bin body
    const binGeometry = new THREE.BoxGeometry(1.5, 2, 1.5);
    const binMaterial = new THREE.MeshPhongMaterial({ 
        color: COLORS.BROWN_BIN,
        flatShading: true
    });
    const bin = new THREE.Mesh(binGeometry, binMaterial);
    bin.position.y = 1;
    group.add(bin);
    
    // Bin lid
    const lidGeometry = new THREE.BoxGeometry(1.7, 0.2, 1.7);
    const lidMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x6d4c41,
        flatShading: true
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 2.1;
    group.add(lid);
    
    // Label
    const labelGeometry = new THREE.PlaneGeometry(1, 0.5);
    const labelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        flatShading: true
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, 1.5, 0.76);
    group.add(label);
    
    // Add visual indicator
    const indicatorGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.01);
    const indicatorMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicator.position.set(0, 1.5, 0.77);
    group.add(indicator);
    
    group.userData = { type: 'bin', binType: 'food-waste' };
    return group;
}

// Create a simple building for the background
function createBuilding(width, height, depth, color) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhongMaterial({ 
        color: color,
        flatShading: true
    });
    const building = new THREE.Mesh(geometry, material);
    
    // Add windows
    const windowSize = Math.min(width, depth) * 0.15;
    const windowGeometry = new THREE.BoxGeometry(windowSize, windowSize, 0.1);
    const windowMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x87CEEB,
        flatShading: true,
        transparent: true,
        opacity: 0.7
    });
    
    const windowRows = Math.floor(height / (windowSize * 2));
    const windowCols = Math.floor(width / (windowSize * 2));
    
    for (let i = 0; i < windowRows; i++) {
        for (let j = 0; j < windowCols; j++) {
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(
                -width/2 + windowSize + j * windowSize * 2,
                -height/2 + windowSize + i * windowSize * 2,
                depth/2 + 0.01
            );
            building.add(window);
        }
    }
    
    return building;
}

// Create a city skyline for the background
function createCityBackground() {
    const group = new THREE.Group();
    
    // Create ground with grass texture
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x7ccc5b, 
        flatShading: false,
        shininess: 10
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    group.add(ground);
    
    // Create several buildings of different heights and colors
    const buildingColors = [
        0x95a5a6, 0x7f8c8d, 0xbdc3c7, 0x34495e, 0x2c3e50, 0x3498db, 0x2980b9
    ];
    
    // Create a more varied skyline
    for (let i = -10; i <= 10; i += 1.5) {
        if (Math.random() > 0.7) continue; // Skip some positions for variety
        
        const width = 1 + Math.random() * 2;
        const height = 5 + Math.random() * 20;
        const depth = 1 + Math.random() * 2;
        const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
        
        const building = createBuilding(width, height, depth, color);
        building.position.set(i * 2, height/2, -20 - Math.random() * 10);
        group.add(building);
    }
    
    // Add some trees
    for (let i = -15; i <= 15; i += 3) {
        if (Math.random() > 0.6) {
            const tree = createTree();
            tree.position.set(i + Math.random() * 2 - 1, 0, -10 - Math.random() * 5);
            group.add(tree);
        }
    }
    
    // Add clouds
    for (let i = -20; i <= 20; i += 5) {
        if (Math.random() > 0.5) {
            const cloud = createCloud();
            cloud.position.set(i + Math.random() * 4 - 2, 15 + Math.random() * 10, -30 - Math.random() * 10);
            group.add(cloud);
        }
    }
    
    // Add sun
    const sun = createSun();
    sun.position.set(15, 20, -40);
    group.add(sun);
    
    return group;
}

// Create a simple tree
function createTree() {
    const group = new THREE.Group();
    
    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8B4513, 
        flatShading: true 
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);
    
    // Tree foliage (multiple layers for more realistic look)
    const foliageColors = [0x2ecc71, 0x27ae60, 0x229954];
    
    for (let i = 0; i < 3; i++) {
        const size = 1.5 - i * 0.3;
        const height = 1.5 + i * 0.7;
        const foliageGeometry = new THREE.ConeGeometry(size, size, 8);
        const foliageMaterial = new THREE.MeshPhongMaterial({ 
            color: foliageColors[i], 
            flatShading: true 
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = height;
        foliage.castShadow = true;
        foliage.receiveShadow = true;
        group.add(foliage);
    }
    
    return group;
}

// Create a cloud
function createCloud() {
    const group = new THREE.Group();
    
    const cloudMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff, 
        flatShading: true,
        transparent: true,
        opacity: 0.9
    });
    
    // Create multiple spheres for a fluffy cloud look
    const numPuffs = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numPuffs; i++) {
        const puffSize = 1 + Math.random() * 1.5;
        const puffGeometry = new THREE.SphereGeometry(puffSize, 7, 7);
        const puff = new THREE.Mesh(puffGeometry, cloudMaterial);
        
        // Position puffs to form a cloud shape
        const angle = (i / numPuffs) * Math.PI * 2;
        const radius = 1 + Math.random() * 0.5;
        puff.position.x = Math.cos(angle) * radius;
        puff.position.y = Math.sin(angle) * radius * 0.6;
        puff.position.z = Math.random() * 2 - 1;
        
        group.add(puff);
    }
    
    return group;
}

// Create a sun
function createSun() {
    const sunGeometry = new THREE.SphereGeometry(3, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffdd00
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(3.5, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(glow);
    
    return sun;
}

// Create a simple ground plane
function createGround() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x2ecc71,
        flatShading: true
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    
    // Add a road
    const roadGeometry = new THREE.PlaneGeometry(4, 100);
    const roadMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x34495e,
        flatShading: true
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.01;
    
    // Add road markings
    const markingGeometry = new THREE.BoxGeometry(0.2, 2, 0.01);
    const markingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    
    for (let i = -25; i <= 25; i += 5) {
        const marking = new THREE.Mesh(markingGeometry, markingMaterial);
        marking.rotation.x = -Math.PI / 2;
        marking.position.set(0, 0.02, i);
        road.add(marking);
    }
    
    ground.add(road);
    
    return ground;
}

// Function to create a random waste item
function createRandomWasteItem() {
    const itemType = Math.random();
    let item;
    
    if (itemType < 0.25) { // 25% chance of recyclable items
        const types = ['bottle', 'can', 'paper', 'cardboard-box', 'glass-jar'];
        const type = types[Math.floor(Math.random() * types.length)];
        item = createRecyclableItem(type);
        
        // Ensure userData is properly set
        if (!item.userData) item.userData = {};
        item.userData.type = 'recyclable';
        item.userData.binType = 'recyclable';
        item.userData.points = item.userData.points || 10;
        
    } else if (itemType < 0.5) { // 25% chance of non-recyclable items
        const types = ['styrofoam', 'diaper', 'food-waste'];
        const type = types[Math.floor(Math.random() * types.length)];
        item = createNonRecyclableItem(type);
        
        // Ensure userData is properly set
        if (!item.userData) item.userData = {};
        if (type === 'food-waste') {
            item.userData.type = 'food-waste';
            item.userData.binType = 'food-waste';
        } else {
            item.userData.type = 'non-recyclable';
            item.userData.binType = 'non-recyclable';
        }
        item.userData.points = item.userData.points || -5;
        
    } else if (itemType < 0.75) { // 25% chance of fresh food items
        const types = ['apple', 'banana', 'milk'];
        const type = types[Math.floor(Math.random() * types.length)];
        item = createFreshFoodItem(type);
        
        // Ensure userData is properly set
        if (!item.userData) item.userData = {};
        item.userData.type = 'fresh-food';
        item.userData.containerType = 'fresh-food';
        item.userData.points = item.userData.points || 8;
        
    } else { // 25% chance of non-perishable food items
        const types = ['can-food', 'cereal', 'pasta'];
        const type = types[Math.floor(Math.random() * types.length)];
        item = createNonPerishableItem(type);
        
        // Ensure userData is properly set
        if (!item.userData) item.userData = {};
        item.userData.type = 'non-perishable';
        item.userData.containerType = 'non-perishable';
        item.userData.points = item.userData.points || 7;
    }
    
    // Make sure all items can cast and receive shadows
    item.traverse(function(child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    return item;
}
