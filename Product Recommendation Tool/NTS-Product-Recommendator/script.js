$(document).ready(function() {
    let currentStep = 0; // Start at welcome screen
    const totalSteps = 5; // Welcome + 4 steps
    let userSelections = {};

    // Nutri-Tech Solutions product data
    const products = [
      {
        "product_name": "Nutri-Life B.Sub™",
        "description": "New Activator Technology – Beneficial bacterial bio-balancers with plant growth promoting capacity. B.Sub™ contains selected, vigorous strains of Bacillus subtilis. Includes an Activator powder containing protein precursors for enhanced beneficial metabolite production.",
        "microbes": ["Bacillus subtilis"]
      },
      {
        "product_name": "Nutri-Life BAM™",
        "description": "This breakthrough probiotic blend contains lactic acid bacteria and purple non-sulfur bacteria, plus beneficial yeasts and microbial exudates.",
        "microbes": ["Lactic acid bacteria","Purple non-sulfur bacteria","Beneficial yeasts","Fermenting fungi"]
      },
      {
        "product_name": "Nutri-Life Bio-N™",
        "description": "Natural nitrogen captured from the atmosphere and converted to plant-available nitrogen in the root zone. Nutri-Life Bio-N™ contains organisms capable of converting atmospheric nitrogen to ammonium nitrogen in the soil. Azotobacter vinelandii, a free-living nitrogen fixer, can tap into the 74,000 tonnes of nitrogen gas hanging over every hectare. Azotobacter vinelandii also secrete hygroscopic mucilage in the root-zone, which assists in retaining soil moisture. Nutri-Life Bio-N™ has proven a reliable and consistent performer in Australian conditions since 1998.",
        "microbes": ["Azotobacter vinelandii (nitrogen-fixing bacteria)"]
      },
      {
        "product_name": "Nutri-Life Bio-Plex™",
        "description": "Biologically induced plant growth promotion achieved through the enhancement of leaf life. Nutri-Life Bio-Plex™ is a foliar fertiliser that produces a complex, multi-dimensional growth response. It includes finely tuned nitrogen-fixers, which utilise carbon exudates from the leaf to fix nitrogen from the atmosphere directly into the leaf and a range of microbes that release natural growth promotants such as gibberellic acid, cytokinins, auxins and indoleacetic acid. Contains species that produce vitamins including C, E and B group, as well as a range of organisms that secrete a substance that can help maintain balance of beneficials on the leaf surface.",
        "microbes": ["Azotobacter vinelandii (nitrogen-fixing bacteria)","Bacillus subtilis"]
      },
      {
        "product_name": "Nutri-Life Bio-P™",
        "description": "Bacteria which break free insoluble reserves of locked up phosphorus in agricultural soils. All soils with a history of applied fertilisers contain large amounts of insoluble phosphate, due to the dynamics of the phosphate ion. Nutri-Life Bio-P™ is designed to solubilise those frozen reserves utilising Bacillus species. The CSIRO have estimated that Australian soils contain ten billion dollars of applied phosphorus.",
        "microbes": ["Bacillus polymyxa (phosphate-solubilising bacteria)","Bacillus megaterium (phosphate-solubilising bacteria)"]
      },
      {
        "product_name": "Nutri-Life Micro-Force™",
        "description": "Multi-task microbial inoculum. Nutri-Life Micro-Force™ contains a blend of beneficial soil and plant microbes specifically designed to produce a robust bacterial dominated brew. On-farm brewing allows economical access to the diverse benefits of this species blend which can be soil or foliar applied depending on the desired result.",
        "microbes": ["Bacillus amyloliquefaciens","Bacillus licheniformis","Bacillus megaterium","Bacillus pumilus","Bacillus subtilis"]
      },
      {
        "product_name": "Nutri-Life Myco-Force™",
        "description": "Naturally improve health and quality of soil by repopulating with naturally occurring, beneficial fungal species. Myco-Force™ is a talc-based formulation containing the beneficial fungal species Beauveria bassiana, Metarhizium anisopliae, and Lecanicillium lecanii.",
        "microbes": ["Beauveria bassiana","Metarhizium anisopliae","Lecanicillium lecanii"]
      },
      {
        "product_name": "Nutri-Life Platform®",
        "description": "NEW AND IMPROVED BLEND – Arbuscular Mycorrhizal Fungi (AMF) (4 species) now blended with a broader range of beneficial microbes including Bacillus species. New and improved blend to be applied by seed treatment or seedling dip.",
        "microbes": ["Arbuscular Mycorrhizal Fungi (AMF)","Glomus intraradices","Glomus clarum","Glomus aggregatum","Glomus deserticola","Glomus macrocarpum","Glomus caledonium","Glomus mosseae","Gigaspora rosea","Gigaspora margarita","Scutelospora heterogama","Azospirillum brasilense","Azotobacter chroococcum","Gluconacetobacter diazotrophicus","Bacillus megaterium","Pseudomonas fluorescens"]
      },
      {
        "product_name": "Nutri-Life Root-Guard™",
        "description": "A blend of beneficial fungi designed to improve the ratio of desirable to undesirable organisms in the root zone. Root-Guard™ is a talc-based formulation containing the naturally occurring fungal species Trichoderma harzianum.",
        "microbes": ["Trichoderma harzianum"]
      },
      {
        "product_name": "Nutri-Life Sudo-Shield™",
        "description": "Sudo-Shield™ is a revolutionary new biological inoculum featuring Pseudomonas fluorescens. Sudo-Shield™ is designed to assist in the recovery of previously affected pathogen damaged soils & plants.",
        "microbes": ["Pseudomonas fluorescens"]
      },
      {
        "product_name": "Nutri-Life Tricho-Shield™",
        "description": "Beneficial fungi to improve the balance between desirable and undesirable microorganisms on the leaf surface and in the soil. Tricho-Shield™ is a talc-based formulation containing the beneficial fungal species Trichoderma harzianum, Trichoderma lignorum and Trichoderma koningii, which promote plant and root growth.",
        "microbes": ["Trichoderma harzianum","Trichoderma lignorum","Trichoderma koningii"]
      }
    ];

    // Microbe-to-benefit matrix
    const microbeBenefitMatrix = [
      { microbe: "Bacillus subtilis", benefits: ["pathogen", "root", "soil_balance", "foliar", "hormones"] },
      { microbe: "Lactic acid bacteria", benefits: ["soil_balance", "pathogen"] },
      { microbe: "Purple non-sulfur bacteria", benefits: ["soil_balance", "hormones"] },
      { microbe: "Beneficial yeasts", benefits: ["soil_balance", "pathogen"] },
      { microbe: "Fermenting fungi", benefits: ["soil_balance", "pathogen"] },
      { microbe: "Azotobacter vinelandii (nitrogen-fixing bacteria)", benefits: ["nitrogen", "moisture", "root"] },
      { microbe: "Azotobacter chroococcum", benefits: ["nitrogen", "root"] },
      { microbe: "Gluconacetobacter diazotrophicus", benefits: ["nitrogen", "root"] },
      { microbe: "Azospirillum brasilense", benefits: ["nitrogen", "root"] },
      { microbe: "Bacillus polymyxa (phosphate-solubilising bacteria)", benefits: ["phosphorus", "soil_balance"] },
      { microbe: "Bacillus megaterium (phosphate-solubilising bacteria)", benefits: ["phosphorus", "soil_balance"] },
      { microbe: "Bacillus megaterium", benefits: ["phosphorus", "soil_balance"] },
      { microbe: "Bacillus amyloliquefaciens", benefits: ["root", "pathogen", "soil_balance"] },
      { microbe: "Bacillus licheniformis", benefits: ["root", "soil_balance"] },
      { microbe: "Bacillus pumilus", benefits: ["root", "soil_balance"] },
      { microbe: "Beauveria bassiana", benefits: ["pathogen"] },
      { microbe: "Metarhizium anisopliae", benefits: ["pathogen"] },
      { microbe: "Lecanicillium lecanii", benefits: ["pathogen"] },
      { microbe: "Arbuscular Mycorrhizal Fungi (AMF)", benefits: ["mycorrhizae", "root", "soil_balance"] },
      { microbe: "Glomus intraradices", benefits: ["mycorrhizae", "root"] },
      { microbe: "Glomus clarum", benefits: ["mycorrhizae", "root"] },
      { microbe: "Glomus aggregatum", benefits: ["mycorrhizae", "root"] },
      { microbe: "Glomus deserticola", benefits: ["mycorrhizae", "root"] },
      { microbe: "Glomus macrocarpum", benefits: ["mycorrhizae", "root"] },
      { microbe: "Glomus caledonium", benefits: ["mycorrhizae", "root"] },
      { microbe: "Glomus mosseae", benefits: ["mycorrhizae", "root"] },
      { microbe: "Gigaspora rosea", benefits: ["mycorrhizae", "root"] },
      { microbe: "Gigaspora margarita", benefits: ["mycorrhizae", "root"] },
      { microbe: "Scutelospora heterogama", benefits: ["mycorrhizae", "root"] },
      { microbe: "Pseudomonas fluorescens", benefits: ["pathogen", "soil_balance"] },
      { microbe: "Trichoderma harzianum", benefits: ["pathogen", "root", "soil_balance", "foliar"] },
      { microbe: "Trichoderma lignorum", benefits: ["pathogen", "root", "soil_balance"] },
      { microbe: "Trichoderma koningii", benefits: ["pathogen", "root", "soil_balance", "foliar"] }
    ];

    // Load product and benefit data
    let allProducts = [];
    let allBenefits = [];
    let productsLoaded = false;
    let benefitsLoaded = false;

    // Disable the button until data is loaded
    $('#recommend-btn').prop('disabled', true).text('Loading...');

    // Load products
    fetch('recommendation_products.json')
      .then(response => response.json())
      .then(data => {
        allProducts = data;
        productsLoaded = true;
        if (productsLoaded && benefitsLoaded) {
          $('#recommend-btn').prop('disabled', false).text('Show Recommendations');
        }
      });

    // Load benefits
    fetch('microbe_benefits_database.json')
      .then(response => response.json())
      .then(data => {
        allBenefits = data;
        benefitsLoaded = true;
        if (productsLoaded && benefitsLoaded) {
          $('#recommend-btn').prop('disabled', false).text('Show Recommendations');
        }
      });

    // Update progress bar
    function updateProgress() {
        const progress = (currentStep / (totalSteps - 1)) * 100;
        $('.progress-bar').css('width', progress + '%');
    }

    // Show/hide steps
    function showStep(stepNumber) {
        $('.step').hide();
        if (stepNumber === 0) {
            $('#welcome').show();
        } else {
            $(`#step${stepNumber}`).show();
        }
        
        // Update buttons
        if (stepNumber === 0) {
            $('#prev-btn').hide();
            $('#next-btn').text('Get Started');
        } else if (stepNumber === 1) {
            $('#prev-btn').show();
            $('#next-btn').text('Next');
        } else if (stepNumber === totalSteps - 1) {
            $('#next-btn').text('Finish');
        } else {
            $('#next-btn').text('Next');
        }
        
        updateProgress();
    }

    // Secondary options based on primary purpose
    const secondaryOptions = {
        'nitrogen-fixation': [
            { value: 'legume-crops', label: 'Legume Crops' },
            { value: 'non-legume-crops', label: 'Non-Legume Crops' },
            { value: 'soil-enrichment', label: 'Soil Enrichment' }
        ],
        'pest-control': [
            { value: 'insect-pests', label: 'Insect Pests' },
            { value: 'nematodes', label: 'Nematodes' },
            { value: 'fungal-pests', label: 'Fungal Pests' }
        ],
        'disease-control': [
            { value: 'bacterial-diseases', label: 'Bacterial Diseases' },
            { value: 'fungal-diseases', label: 'Fungal Diseases' },
            { value: 'viral-diseases', label: 'Viral Diseases' }
        ],
        'soil-health': [
            { value: 'organic-matter', label: 'Organic Matter Decomposition' },
            { value: 'nutrient-cycling', label: 'Nutrient Cycling' },
            { value: 'soil-structure', label: 'Soil Structure Improvement' }
        ],
        'plant-growth': [
            { value: 'root-development', label: 'Root Development' },
            { value: 'nutrient-uptake', label: 'Nutrient Uptake' },
            { value: 'stress-tolerance', label: 'Stress Tolerance' }
        ]
    };

    // Specific requirements based on secondary selection
    const specificRequirements = {
        'legume-crops': [
            { value: 'soybeans', label: 'Soybeans' },
            { value: 'peas', label: 'Peas' },
            { value: 'beans', label: 'Beans' }
        ],
        // Add more specific requirements for other categories
    };

    // Handle primary purpose selection
    $('#primary-purpose').change(function() {
        const selectedPurpose = $(this).val();
        userSelections.primaryPurpose = selectedPurpose;
        
        // Populate secondary options
        const options = secondaryOptions[selectedPurpose] || [];
        let html = '<select class="form-select" id="secondary-purpose" required>';
        html += '<option value="">Select an option...</option>';
        options.forEach(option => {
            html += `<option value="${option.value}">${option.label}</option>`;
        });
        html += '</select>';
        $('#secondary-options').html(html);
    });

    // Handle secondary purpose selection
    $(document).on('change', '#secondary-purpose', function() {
        const selectedSecondary = $(this).val();
        userSelections.secondaryPurpose = selectedSecondary;
        
        // Populate specific requirements
        const requirements = specificRequirements[selectedSecondary] || [];
        let html = '<select class="form-select" id="specific-requirement" required>';
        html += '<option value="">Select a requirement...</option>';
        requirements.forEach(req => {
            html += `<option value="${req.value}">${req.label}</option>`;
        });
        html += '</select>';
        $('#specific-requirements').html(html);
    });

    // Handle specific requirement selection
    $(document).on('change', '#specific-requirement', function() {
        userSelections.specificRequirement = $(this).val();
    });

    // Show/hide pathogen questions based on function checkbox selection
    $(document).on('change', '#funcPathogen', function() {
        if ($(this).is(':checked')) {
            $('#pathogenScope').slideDown();
            $('#pathogenType').slideDown();
        } else {
            $('#pathogenScope').slideUp();
            $('#pathogenType').slideUp();
        }
    });

    // Recommendation logic
    $('#recommend-btn').on('click', function() {
        // Gather selected benefits from checkboxes (use label text for now)
        const selectedBenefits = $('#functionCheckboxes input[type=checkbox]:checked').map(function() {
            return $(this).parent().text().trim();
        }).get();
        const applicationMethod = $('#applicationMethod').val();
        let pathogenScope = null;
        let pathogenTypes = [];

        // Validation: at least one benefit must be selected
        if (selectedBenefits.length === 0) {
            alert('Please select at least one problem or function to target.');
            return;
        }
        if (!applicationMethod) {
            alert('Please select an application method.');
            return;
        }
        if ($('#funcPathogen').is(':checked')) {
            pathogenScope = $('#pathogenTypeScope').val();
            pathogenTypes = [
                $('#threatFungi').is(':checked') ? 'fungi' : null,
                $('#threatBacteria').is(':checked') ? 'bacteria' : null,
                $('#threatVirus').is(':checked') ? 'virus' : null,
                $('#threatInsects').is(':checked') ? 'insects' : null,
                $('#threatNematodes').is(':checked') ? 'nematodes' : null
            ].filter(Boolean);
            if (!pathogenScope) {
                alert('Please select the type of pathogen problem.');
                return;
            }
            if (pathogenTypes.length === 0) {
                alert('Please select at least one target threat.');
                return;
            }
        }

        // Wait for data to be loaded
        if (!allProducts.length || !allBenefits.length) {
            alert('Loading data, please try again in a moment.');
            return;
        }

        // Filter products by selected benefits
        const matchingProducts = allProducts.filter(product =>
            product.benefits.some(benefit => selectedBenefits.includes(benefit))
        );

        // Display results
        let html = '<div class="recommendation-list">';
        if (matchingProducts.length > 0) {
            html += '<h5>Recommended Products</h5>';
            matchingProducts.forEach(product => {
                // Find which benefits matched
                const matchedBenefits = product.benefits.filter(benefit => selectedBenefits.includes(benefit));
                html += `
                    <div class="recommendation-item mb-4">
                        <h4>${product.product_name}</h4>
                        <div><strong>Matching Benefits:</strong> ${matchedBenefits.join(', ')}</div>
                        <div><strong>All Benefits:</strong> ${product.benefits.join(', ')}</div>
                        <div><strong>Microbes:</strong> ${product.microbes.map(m => m.name).join(', ')}</div>
                    </div>
                `;
            });
        } else {
            html += '<p>No specific product recommendations found for your selection. Please contact our support team for more information.</p>';
        }
        html += '</div>';
        $('#recommendation-results').html(html);
        document.getElementById('recommendation-results').scrollIntoView({ behavior: 'smooth' });
    });

    // Next button click
    $('#next-btn').click(function() {
        if (currentStep < totalSteps - 1) {
            // Validate current step
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
                
                // If we're moving to the results step, generate recommendations
                if (currentStep === totalSteps - 1) {
                    generateRecommendations();
                }
            }
        } else {
            // Handle form completion
            alert('Thank you for using our recommendation tool!');
        }
    });

    // Previous button click
    $('#prev-btn').click(function() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Validate current step
    function validateStep(step) {
        switch(step) {
            case 0: // Welcome screen
                return true;
            case 1:
                return $('#primary-purpose').val() !== '';
            case 2:
                return $('#secondary-purpose').val() !== '';
            case 3:
                return $('#specific-requirement').val() !== '';
            default:
                return true;
        }
    }

    // Generate recommendations based on user selections
    function generateRecommendations() {
        // Map the user's selection to a microbe (this should be expanded as you add more specific requirements)
        const microbeMap = {
            'soybeans': ['Rhizobium japonicum', 'Bacillus subtilis', 'Azotobacter vinelandii (nitrogen-fixing bacteria)'],
            'peas': ['Rhizobium leguminosarum'],
            'beans': ['Rhizobium tropici'],
            // Add more mappings as you expand the form
        };
        const selectedRequirement = userSelections.specificRequirement;
        const selectedMicrobes = microbeMap[selectedRequirement] || [];

        // Find all products that contain any of the selected microbes
        const matchingProducts = products.filter(product =>
            product.microbes.some(microbe => selectedMicrobes.includes(microbe))
        );

        let html = '<div class="recommendation-list">';
        if (matchingProducts.length > 0) {
            matchingProducts.forEach(product => {
                // Find which microbes matched
                const matchedMicrobes = product.microbes.filter(microbe => selectedMicrobes.includes(microbe));
                html += `
                    <div class="recommendation-item mb-4">
                        <h4>${product.product_name}</h4>
                        <p>${product.description}</p>
                        <div class="product-info">
                            <strong>Matching Microbe(s):</strong> ${matchedMicrobes.join(', ')}
                        </div>
                    </div>
                `;
            });
        } else {
            html += '<p>No specific recommendations found for your selection. Please contact our support team for more information.</p>';
        }
        html += '</div>';
        
        $('#recommendation-results').html(html);
    }

    // Welcome screen logic
    $(document).on('click', '#show-welcome-recommend-btn', function() {
        $('#welcome').hide();
        $('#step1').show();
    });

    // Initialize Choices.js for all select.form-select elements
    $('select.form-select').each(function() {
        new Choices(this, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false
        });
    });

    // Initialize the form
    showStep(0);
}); 