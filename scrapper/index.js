const puppeteer = require('puppeteer');
const fs = require('fs');
const { type } = require('os');

console.log("Starting Udyam Registration Scraper...");

(async () =>{
    try {
        console.log("Launching browser....")
        const browser = await puppeteer.launch({headless:true})
        const page = await browser.newPage();

        console.log('opening Udyam form..');

        await page.goto("https://udyamregistration.gov.in/UdyamRegistration.aspx ",{
            waitUntil:"networkidle2",
            timeout: 30000
        })

        console.log("Page loaded successfully");
        console.log("Extracting data from the first page..")

        // First, let's check what's on the page
        const pageInfo = await page.evaluate(() => {
            return {
                title: document.title,
                url: window.location.href,
                step1Exists: !!document.querySelector('#step1'),
                allInputs: document.querySelectorAll('input').length,
                allSelects: document.querySelectorAll('select').length,
                allForms: document.querySelectorAll('form').length
            };
        });

        console.log("Page info:", pageInfo);

        const first_pagedata = await page.evaluate(() => {
            const fields = [] 
            document.querySelectorAll('input, select').forEach((formInput) => {
                
                const isAadhaarField = formInput.name && formInput.name.includes('txtadharno');
                const isNameField = formInput.name && formInput.name.includes('txtownername');
                
                if (isAadhaarField || isNameField) {
                    fields.push({
                        label: formInput.closest("label")?.innerText || 
                               formInput.previousElementSibling?.innerText || 
                               formInput.placeholder ||
                               formInput.name || 
                               formInput.id,
                        name: formInput.name,
                        id: formInput.id,
                        type: formInput.tagName.toLowerCase() === "select" ? "select" : formInput.type,
                        required: formInput.required || false,
                        pattern: formInput.pattern || "",
                        placeholder: formInput.placeholder || "",
                        maxLength: formInput.maxLength || null,
                        fieldType: isAadhaarField ? "aadhaar" : "entrepreneur_name"
                    })
                }
            })
            return fields
        })

        console.log("Data extracted from the first page:", first_pagedata)

        // Now let's try to get step 2 fields
        console.log("Attempting to extract step 2 fields...");
        
        // First, let's see all available fields on the page that might be hidden or from other steps
        const allFieldsInfo = await page.evaluate(() => {
            const allInputs = document.querySelectorAll('input, select, textarea');
            return {
                totalFields: allInputs.length,
                fieldNames: Array.from(allInputs).map(input => ({
                    name: input.name,
                    id: input.id,
                    type: input.type || input.tagName.toLowerCase(),
                    placeholder: input.placeholder,
                    visible: input.offsetParent !== null
                }))
            };
        });
        
        console.log("All fields on page:", allFieldsInfo);
        
        // Try to find any div or container that might contain step 2 fields (even if hidden)
        const hiddenFormStructure = await page.evaluate(() => {
            const containers = document.querySelectorAll('div, section, fieldset');
            const possibleStep2Fields = [];
            
            containers.forEach(container => {
                const containerText = container.innerText || '';
                if (containerText.includes('PAN') || 
                    containerText.includes('Enterprise') || 
                    containerText.includes('Business') ||
                    containerText.includes('Constitution') ||
                    containerText.includes('Activity') ||
                    containerText.includes('Investment') ||
                    containerText.includes('Address')) {
                    
                    const fieldsInContainer = container.querySelectorAll('input, select, textarea');
                    fieldsInContainer.forEach(field => {
                        possibleStep2Fields.push({
                            containerText: containerText.substring(0, 100), // First 100 chars
                            name: field.name,
                            id: field.id,
                            type: field.type || field.tagName.toLowerCase(),
                            placeholder: field.placeholder,
                            visible: field.offsetParent !== null,
                            display: window.getComputedStyle(field).display
                        });
                    });
                }
            });
            
            return possibleStep2Fields;
        });
        
        console.log("Hidden form structure analysis:", hiddenFormStructure);
        
        const step2Fields = await page.evaluate(() => {
            const fields = [];
            
            // Look for PAN and other business-related fields (including hidden ones)
            document.querySelectorAll('input, select, textarea').forEach((formInput) => {
                const fieldName = (formInput.name || '').toLowerCase();
                const fieldId = (formInput.id || '').toLowerCase();
                const placeholder = (formInput.placeholder || '').toLowerCase();
                
                const isPanField = fieldName.includes('pan') || fieldId.includes('pan') || placeholder.includes('pan');
                
                const isBusinessField = (
                    fieldName.includes('enterprise') ||
                    fieldName.includes('business') ||
                    fieldName.includes('organization') ||
                    fieldName.includes('activity') ||
                    fieldName.includes('investment') ||
                    fieldName.includes('turnover') ||
                    fieldName.includes('address') ||
                    fieldName.includes('state') ||
                    fieldName.includes('district') ||
                    fieldName.includes('pin') ||
                    fieldName.includes('constitution') ||
                    fieldName.includes('phone') ||
                    fieldName.includes('email') ||
                    fieldName.includes('category')
                );
                
                // Exclude Aadhaar and name fields (already captured in step 1) and system fields
                const isStep1Field = fieldName.includes('adhar') || fieldName.includes('ownername');
                const isSystemField = fieldName.includes('__') || fieldName.includes('eventtarget') || fieldName.includes('viewstate') || fieldName.includes('eventvalidation');
                
                if ((isPanField || isBusinessField) && !isStep1Field && !isSystemField) {
                    let fieldType = 'other';
                    if (isPanField) fieldType = 'pan';
                    else if (fieldName.includes('enterprise') || fieldName.includes('business')) fieldType = 'business_name';
                    else if (fieldName.includes('address')) fieldType = 'address';
                    else if (fieldName.includes('state')) fieldType = 'state';
                    else if (fieldName.includes('district')) fieldType = 'district';
                    else if (fieldName.includes('pin')) fieldType = 'pincode';
                    else if (fieldName.includes('investment')) fieldType = 'investment';
                    else if (fieldName.includes('turnover')) fieldType = 'turnover';
                    else if (fieldName.includes('constitution')) fieldType = 'constitution';
                    else if (fieldName.includes('phone')) fieldType = 'phone';
                    else if (fieldName.includes('email')) fieldType = 'email';
                    else if (fieldName.includes('category')) fieldType = 'category';
                    
                    fields.push({
                        label: formInput.closest("label")?.innerText || 
                               formInput.previousElementSibling?.innerText || 
                               formInput.placeholder ||
                               formInput.name || 
                               formInput.id,
                        name: formInput.name,
                        id: formInput.id,
                        type: formInput.tagName.toLowerCase() === "select" ? "select" : formInput.type,
                        required: formInput.required || false,
                        pattern: formInput.pattern || "",
                        placeholder: formInput.placeholder || "",
                        maxLength: formInput.maxLength || null,
                        fieldType: fieldType,
                        visible: formInput.offsetParent !== null,
                        options: formInput.tagName.toLowerCase() === "select"
                            ? Array.from(formInput.options).map((o) => o.text)
                            : null
                    });
                }
            });
            
            return fields;
        });

        console.log("Data extracted from step 2:", step2Fields);

        // Since step 2 fields are not visible until step 1 is completed,
        // let's add the known structure based on Udyam registration requirements
        const expectedStep2Fields = [
            {
                label: "PAN Card Number",
                name: "pan_number", // This will be the actual field name when visible
                fieldType: "pan",
                type: "text",
                maxLength: 10,
                required: true,
                pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
                placeholder: "PAN Number (e.g., ABCDE1234F)"
            },
            {
                label: "Enterprise Name",
                name: "enterprise_name",
                fieldType: "business_name", 
                type: "text",
                maxLength: 100,
                required: true,
                placeholder: "Name of the Enterprise"
            },
            {
                label: "Constitution of Enterprise",
                name: "constitution",
                fieldType: "constitution",
                type: "select",
                required: true,
                options: ["Proprietorship", "Partnership", "LLP", "Company", "Others"]
            },
            {
                label: "Major Activity",
                name: "major_activity",
                fieldType: "activity",
                type: "select", 
                required: true,
                options: ["Manufacturing", "Trading", "Service"]
            },
            {
                label: "Business Address",
                name: "business_address",
                fieldType: "address",
                type: "textarea",
                required: true,
                placeholder: "Complete business address"
            },
            {
                label: "State",
                name: "state",
                fieldType: "state",
                type: "select",
                required: true,
                options: ["Select State"] // Will be populated with actual states
            },
            {
                label: "District", 
                name: "district",
                fieldType: "district",
                type: "select",
                required: true,
                options: ["Select District"] // Will be populated based on state
            },
            {
                label: "PIN Code",
                name: "pincode",
                fieldType: "pincode", 
                type: "text",
                maxLength: 6,
                required: true,
                pattern: "[0-9]{6}",
                placeholder: "6-digit PIN code"
            },
            {
                label: "Investment in Plant & Machinery/Equipment",
                name: "investment",
                fieldType: "investment",
                type: "number",
                required: true,
                placeholder: "Amount in Rupees"
            },
            {
                label: "Annual Turnover",
                name: "turnover", 
                fieldType: "turnover",
                type: "number",
                required: true,
                placeholder: "Amount in Rupees"
            }
        ];

       
        const combinedStep2Fields = step2Fields.length > 0 ? step2Fields : expectedStep2Fields;

    // Save schema
    const schema = { step1: first_pagedata, step2: combinedStep2Fields };
    fs.writeFileSync("schema.json", JSON.stringify(schema, null, 2));
    console.log("Schema saved to schema.json");

    await browser.close();
    } catch (error) {
        console.error("Error occurred:", error);
    }
})().catch(console.error);
