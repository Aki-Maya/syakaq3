#!/usr/bin/env node

/**
 * Specific Problem Removal Tool
 * 特定の問題を削除するツール - "熱中症公家諸法度" などの残存問題を確実に除去
 */

const fs = require('fs');
const path = require('path');

class SpecificProblemRemover {
    constructor() {
        this.inputFile = path.join(__dirname, 'src/data/questions-unified.ts');
        this.backupFile = path.join(__dirname, 'specific-problem-backup-' + Date.now() + '.ts');
        
        // Specific problematic terms to search and remove
        this.problematicTerms = [
            '熱中症公家諸法度',
            '禁中並公家諸法度について正しい説明を選んでください', // If mistitled
            '熱中症',  // If combined with historical terms inappropriately
        ];
        
        this.stats = {
            total: 0,
            removed: 0,
            final: 0
        };
    }

    async run() {
        console.log('🔧 Removing specific problematic questions...\n');
        
        try {
            // Create backup
            await this.createBackup();
            console.log('✅ Backup created\n');
            
            // Load questions
            const questions = await this.loadQuestions();
            console.log(`📊 Loaded ${questions.length} total questions\n`);
            
            // Remove specific problems
            const cleanedQuestions = await this.removeSpecificProblems(questions);
            console.log(`🗑️ Removed ${this.stats.removed} specific problematic questions`);
            console.log(`✅ Retained ${cleanedQuestions.length} clean questions\n`);
            
            // Save cleaned database
            await this.saveQuestions(cleanedQuestions);
            console.log('💾 Saved cleaned database\n');
            
            console.log('🎉 Specific problem removal completed!');
            this.printStats();
            
        } catch (error) {
            console.error('❌ Error during specific problem removal:', error.message);
            console.error(error.stack);
            process.exit(1);
        }
    }

    async createBackup() {
        const content = fs.readFileSync(this.inputFile, 'utf8');
        fs.writeFileSync(this.backupFile, content);
        console.log(`📋 Backup saved to: ${this.backupFile}`);
    }

    async loadQuestions() {
        const content = fs.readFileSync(this.inputFile, 'utf8');
        
        const match = content.match(/export const unifiedQuestions: UnifiedQuestion\[\] = (\[[\s\S]*?\]);/);
        if (!match) {
            throw new Error('Could not find questions array in file');
        }
        
        const questionsStr = match[1];
        const questions = eval(`(${questionsStr})`);
        
        this.stats.total = questions.length;
        return questions;
    }

    async removeSpecificProblems(questions) {
        const cleanQuestions = [];
        let removedCount = 0;
        
        for (const question of questions) {
            let shouldRemove = false;
            
            // Check if question contains any problematic terms
            for (const term of this.problematicTerms) {
                if (question.question && question.question.includes(term)) {
                    shouldRemove = true;
                    console.log(`🗑️ Removing question with term "${term}": ${question.id}`);
                    console.log(`   Question: ${question.question}`);
                    console.log(`   Options: ${question.options ? question.options.join(' / ') : 'NO OPTIONS'}`);
                    console.log();
                    break;
                }
                
                // Also check in options
                if (question.options) {
                    for (const option of question.options) {
                        if (option && option.includes(term)) {
                            shouldRemove = true;
                            console.log(`🗑️ Removing question with term "${term}" in options: ${question.id}`);
                            console.log(`   Question: ${question.question}`);
                            console.log(`   Options: ${question.options.join(' / ')}`);
                            console.log();
                            break;
                        }
                    }
                }
                
                if (shouldRemove) break;
            }
            
            // Also remove questions with nonsensical mixed terms
            if (!shouldRemove && question.question) {
                // Check for mixed historical and health terms
                if (question.question.includes('熱中症') && (
                    question.question.includes('公家') || 
                    question.question.includes('諸法度') ||
                    question.question.includes('禁中'))) {
                    shouldRemove = true;
                    console.log(`🗑️ Removing mixed-term question: ${question.id}`);
                    console.log(`   Question: ${question.question}`);
                    console.log(`   Reason: Mixed historical and health terms`);
                    console.log();
                }
            }
            
            if (!shouldRemove) {
                cleanQuestions.push(question);
            } else {
                removedCount++;
            }
        }
        
        this.stats.removed = removedCount;
        this.stats.final = cleanQuestions.length;
        
        return cleanQuestions;
    }

    async saveQuestions(questions) {
        // Convert back to proper format with Date objects
        const questionsStr = JSON.stringify(questions, null, 2)
            .replace(/"lastUpdated": "([^"]+)"/g, 'lastUpdated: new Date("$1")')
            .replace(/"createdAt": "([^"]+)"/g, 'createdAt: new Date("$1")');
            
        const content = `// Unified Questions Database for ShakaQuest - Specific Problem Cleaned
// 統一問題データベース - 特定問題除去済み
// Generated: ${new Date().toISOString()}
// Total Questions: ${questions.length}
// Status: Specific problematic questions removed

import { UnifiedQuestion } from './unified-types';

export const unifiedQuestions: UnifiedQuestion[] = ${questionsStr};
`;
        
        fs.writeFileSync(this.inputFile, content);
        console.log(`💾 Updated: ${this.inputFile}`);
    }

    printStats() {
        console.log('\n📊 Specific Problem Removal Statistics:');
        console.log(`   Original questions: ${this.stats.total}`);
        console.log(`   Problematic questions removed: ${this.stats.removed}`);
        console.log(`   Final clean questions: ${this.stats.final}`);
        
        if (this.stats.removed > 0) {
            console.log('\n🎯 Specific problems successfully removed!');
            console.log('   The application should now display clean questions only.');
        } else {
            console.log('\n✅ No specific problems found - database is already clean!');
        }
    }
}

// Run the specific problem remover
if (require.main === module) {
    const remover = new SpecificProblemRemover();
    remover.run().catch(console.error);
}

module.exports = SpecificProblemRemover;