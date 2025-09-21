#!/usr/bin/env node

/**
 * Test Current Data - Verify the application is using clean questions
 */

// Import the unified questions directly
const fs = require('fs');
const path = require('path');

async function testCurrentData() {
    console.log('🔍 Testing current question database...\n');
    
    try {
        const questionsFile = path.join(__dirname, 'src/data/questions-unified.ts');
        const content = fs.readFileSync(questionsFile, 'utf8');
        
        // Extract questions array
        const match = content.match(/export const unifiedQuestions: UnifiedQuestion\[\] = (\[[\s\S]*?\]);/);
        if (!match) {
            throw new Error('Could not find questions array');
        }
        
        const questions = eval(`(${match[1]})`);
        
        console.log(`📊 Total questions in database: ${questions.length}\n`);
        
        // Check for problematic patterns
        const problematicQuestions = questions.filter(q => {
            return q.question && (
                q.question.includes('熱中症公家諸法度') ||
                q.question.includes('禁中並公家諸法度') && q.options && q.options.includes('九州')
            );
        });
        
        if (problematicQuestions.length > 0) {
            console.log('❌ Found problematic questions:');
            problematicQuestions.forEach((q, i) => {
                console.log(`${i+1}. ID: ${q.id}`);
                console.log(`   Question: ${q.question}`);
                console.log(`   Options: ${q.options ? q.options.join(' / ') : 'NO OPTIONS'}`);
                console.log();
            });
        } else {
            console.log('✅ No problematic questions found!');
        }
        
        // Show sample of clean questions
        console.log('\n📚 Sample of current questions:');
        const sampleQuestions = questions.slice(0, 5);
        sampleQuestions.forEach((q, i) => {
            console.log(`${i+1}. [${q.subject.toUpperCase()}] ${q.question.substring(0, 50)}...`);
            console.log(`   Options: ${q.options[0].substring(0, 30)}... / ${q.options[1].substring(0, 30)}...`);
            console.log(`   Quality Score: ${q.qualityScore || 'N/A'}`);
            console.log();
        });
        
        // Subject distribution
        const distribution = {
            geography: questions.filter(q => q.subject === 'geography').length,
            history: questions.filter(q => q.subject === 'history').length,
            civics: questions.filter(q => q.subject === 'civics').length
        };
        
        console.log('📊 Subject Distribution:');
        console.log(`   Geography: ${distribution.geography} questions`);
        console.log(`   History: ${distribution.history} questions`);
        console.log(`   Civics: ${distribution.civics} questions`);
        console.log(`   Total: ${distribution.geography + distribution.history + distribution.civics} questions\n`);
        
        console.log('🎉 Database verification completed!');
        
    } catch (error) {
        console.error('❌ Error testing data:', error.message);
        process.exit(1);
    }
}

testCurrentData();