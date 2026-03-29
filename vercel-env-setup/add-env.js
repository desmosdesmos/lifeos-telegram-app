import { Vercel } from '@vercel/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Читаем токен из ~/.vercel/config.json или используем VERCel_TOKEN из env
const vercelToken = process.env.VERCEL_TOKEN;

if (!vercelToken) {
  console.error('❌ Нет токена Vercel!');
  console.error('Получите токен на: https://vercel.com/account/tokens');
  console.error('Или установите: vercel login');
  console.error('Затем запустите: VERCEL_TOKEN=your_token node add-env.js');
  process.exit(1);
}

const vercel = new Vercel({
  accessToken: vercelToken,
});

const projectId = 'prj_qa4996h7o'; // life-os project
const orgId = 'team_qa4996h7o';

const envVars = [
  {
    key: 'GIGACHAT_CLIENT_ID',
    value: '019d1576-7f92-706a-a2f8-0adad5994c20',
  },
  {
    key: 'GIGACHAT_CLIENT_SECRET',
    value: '4920293f-44df-4dfb-9dc0-73a201323a01',
  },
];

async function main() {
  console.log('🔧 Adding environment variables to Vercel...');
  console.log('Project:', projectId);
  console.log('Organization:', orgId);
  
  for (const env of envVars) {
    try {
      console.log(`\n📝 Adding ${env.key}...`);
      
      const response = await vercel.projects.createProjectEnv({
        idOrName: projectId,
        teamId: orgId,
        requestBody: {
          key: env.key,
          value: env.value,
          type: 'encrypted',
          target: ['production', 'preview', 'development'],
        },
      });
      
      console.log(`✅ ${env.key} added: ${response.id}`);
    } catch (error) {
      if (error.status === 409) {
        console.log(`⚠️  ${env.key} already exists, updating...`);
        
        // Get existing env var
        const existing = await vercel.projects.getProjectEnv({
          idOrName: projectId,
          teamId: orgId,
          envIdOrName: env.key,
        });
        
        // Update it
        const updated = await vercel.projects.updateProjectEnv({
          idOrName: projectId,
          envIdOrName: existing.id,
          teamId: orgId,
          requestBody: {
            value: env.value,
            type: 'encrypted',
            target: ['production', 'preview', 'development'],
          },
        });
        
        console.log(`✅ ${env.key} updated: ${updated.id}`);
      } else {
        console.error(`❌ Error adding ${env.key}:`, error.message || error);
      }
    }
  }
  
  console.log('\n✅ Done! Redeploy your app for changes to take effect.');
  console.log('Run: vercel --prod --yes');
}

main().catch(console.error);
