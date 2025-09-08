#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function debugQuestions() {
    const inputFile = path.join(__dirname, 'src/data/questions-unified.ts');
    const content = fs.readFileSync(inputFile, 'utf8');
    
    console.log('🔍 Debugging question format...\n');
    
    // Try to match the actual format
    let questionsMatch = content.match(/export const unifiedQuestions: UnifiedQuestion\[\] = (\[[\s\S]*\]);/);
    
    if (!questionsMatch) {
        questionsMatch = content.match(/export const questions: Question\[\] = (\[[\s\S]*\]);/);
    }
    
    if (!questionsMatch) {
        console.log('❌ Could not find questions array in file');
        return;
    }
    
    console.log('✅ Found questions array');
    
    const questionsStr = questionsMatch[1];
    
    // Show first 1000 characters of the array
    console.log('📝 First 1000 characters of questions array:');
    console.log(questionsStr.substring(0, 1000));
    console.log('...\n');
    
    // Try to parse just the first question
    const firstQuestionMatch = questionsStr.match(/{\s*"id"[\s\S]*?}(?=,\s*{|$)/);
    if (firstQuestionMatch) {
        console.log('🔍 First question structure:');
        console.log(firstQuestionMatch[0].substring(0, 500));
        console.log('...\n');
        
        // Try to parse it
        try {
            const cleanStr = firstQuestionMatch[0]
                .replace(/new Date\("([^"]+)"\)/g, '"$1"')
                .replace(/(\w+):/g, '"$1":')
                .replace(/,(\s*[\]}])/g, '$1');
                
            console.log('🔧 Cleaned first question for JSON:');
            console.log(cleanStr.substring(0, 300));
            console.log('...\n');
            
            const parsed = JSON.parse(cleanStr);
            console.log('✅ Successfully parsed first question:');
            console.log('ID:', parsed.id);
            console.log('Subject:', parsed.subject);
            console.log('Question:', parsed.question ? parsed.question.substring(0, 100) + '...' : 'Missing');
            console.log('Options length:', parsed.options ? parsed.options.length : 'Missing');
            
        } catch (error) {
            console.log('❌ Failed to parse first question:', error.message);
        }
    } else {
        console.log('❌ Could not extract first question');
    }
}

debugQuestions().catch(console.error);