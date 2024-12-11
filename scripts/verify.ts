import fs from 'fs'
import path from 'path'

class ProjectVerifier {
  private basePath: string
  private errors: string[] = []
  private warnings: string[] = []

  constructor(basePath: string) {
    this.basePath = basePath
  }

  // Verifica a estrutura básica do Next.js
  private checkNextjsStructure() {
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'src/app/layout.tsx',
      'src/app/page.tsx'
    ]

    requiredFiles.forEach(file => {
      if (!fs.existsSync(path.join(this.basePath, file))) {
        this.errors.push(`Arquivo necessário não encontrado: ${file}`)
      }
    })
  }

  // Verifica as dependências necessárias
  private checkDependencies() {
    const packageJson = require(path.join(this.basePath, 'package.json'))
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'tailwindcss'
    ]

    requiredDeps.forEach(dep => {
      if (!packageJson.dependencies[dep]) {
        this.errors.push(`Dependência necessária não encontrada: ${dep}`)
      }
    })
  }

  // Verifica as variáveis de ambiente
  private checkEnvVariables() {
    const envPath = path.join(this.basePath, '.env.local')
    if (!fs.existsSync(envPath)) {
      this.errors.push('Arquivo .env.local não encontrado')
      return
    }

    const envContent = fs.readFileSync(envPath, 'utf8')
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]

    requiredVars.forEach(variable => {
      if (!envContent.includes(variable)) {
        this.errors.push(`Variável de ambiente não encontrada: ${variable}`)
      }
    })
  }

  // Verifica os componentes principais
  private checkComponents() {
    const requiredComponents = [
      'src/components/ClienteForm.tsx',
      'src/components/AparelhoForm.tsx',
      'src/components/OrdemServicoForm.tsx',
      'src/components/GarantiaForm.tsx'
    ]

    requiredComponents.forEach(component => {
      if (!fs.existsSync(path.join(this.basePath, component))) {
        this.errors.push(`Componente não encontrado: ${component}`)
      }
    })
  }

  // Verifica as páginas principais
  private checkPages() {
    const requiredPages = [
      'src/app/clientes/page.tsx',
      'src/app/ordens/page.tsx',
      'src/app/garantias/page.tsx'
    ]

    requiredPages.forEach(page => {
      if (!fs.existsSync(path.join(this.basePath, page))) {
        this.errors.push(`Página não encontrada: ${page}`)
      }
    })
  }

  // Verifica a configuração do banco de dados
  private checkDatabaseConfig() {
    const dbSchemaPath = path.join(this.basePath, 'database/schema.sql')
    if (!fs.existsSync(dbSchemaPath)) {
      this.errors.push('Arquivo de schema do banco de dados não encontrado')
    }
  }

  // Executa todas as verificações
  public verify() {
    console.log('🔍 Iniciando verificação do projeto...\n')

    this.checkNextjsStructure()
    this.checkDependencies()
    this.checkEnvVariables()
    this.checkComponents()
    this.checkPages()
    this.checkDatabaseConfig()

    console.log('📋 Resultado da verificação:\n')

    if (this.errors.length === 0) {
      console.log('✅ Nenhum erro encontrado! O projeto está pronto para deploy.')
    } else {
      console.log('❌ Erros encontrados:')
      this.errors.forEach(error => console.log(`  - ${error}`))
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ Avisos:')
      this.warnings.forEach(warning => console.log(`  - ${warning}`))
    }

    return {
      isReady: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    }
  }
}

// Uso do verificador
const verifier = new ProjectVerifier(process.cwd())
verifier.verify()
