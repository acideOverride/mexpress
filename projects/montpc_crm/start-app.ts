/**
 * MontPC CRM Application Starter
 * Consolidated TypeScript script to start all required services:
 * 1. MongoDB
 * 2. Express API Server
 * 3. Vue.js Frontend
 */

import { spawn, ChildProcess } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import * as path from 'path';

// Configuration
const config = {
  mongodb: {
    port: 27017,
    dbName: 'montpc_crm',
    dataDir: path.join(__dirname, 'data', 'db'),
  },
  api: {
    port: 3000,
    srcPath: path.resolve(__dirname, 'src'),
    routesPath: path.resolve(__dirname, 'src', 'api'),
  },
  frontend: {
    port: 5173,
    srcPath: path.resolve(__dirname, 'frontend'),
  },
  killPorts: [3000, 5173, 5174, 5175, 5176, 5177, 5178],
};

// Service processes
const processes: { [key: string]: ChildProcess } = {};

/**
 * Kill processes on specific ports
 */
function killPortProcesses(): Promise<void> {
  console.log('Killing any existing processes on relevant ports...');
  
  return new Promise((resolve) => {
    const ports = config.killPorts.join(' ');
    const kill = spawn('npx', ['kill-port', ...ports.split(' ')]);
    
    kill.on('close', () => {
      console.log('Ports cleared');
      resolve();
    });
  });
}

/**
 * Start MongoDB
 */
function startMongoDB(): Promise<void> {
  console.log('\n=== Starting MongoDB ===');
  
  // Create data directory if it doesn't exist
  if (!existsSync(config.mongodb.dataDir)) {
    mkdirSync(config.mongodb.dataDir, { recursive: true });
    console.log(`Created MongoDB data directory: ${config.mongodb.dataDir}`);
  }
  
  return new Promise((resolve) => {
    // First check if MongoDB is already running by trying to connect to the port
    const checkPort = spawn('bash', ['-c', `nc -z localhost ${config.mongodb.port} || echo "not running"`]);
    let output = '';
    
    checkPort.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    checkPort.on('close', () => {
      // If output contains "not running", MongoDB is not running
      if (output.includes('not running')) {
        console.log('MongoDB is not running. Starting MongoDB...');
        
        // Check if mongod is available
        const checkMongod = spawn('which', ['mongod']);
        
        checkMongod.on('close', (code) => {
          if (code !== 0) {
            console.error('MongoDB (mongod) not found. Please install MongoDB first.');
            process.exit(1);
          }
          
          // Start MongoDB with the specified data directory
          console.log(`Starting MongoDB with data directory: ${config.mongodb.dataDir}`);
          
          // Using fork mode for cleaner background process management
          const mongod = spawn('mongod', [
            '--dbpath', config.mongodb.dataDir,
            '--port', config.mongodb.port.toString(),
            '--fork',  // Run in background
            '--logpath', path.join(config.mongodb.dataDir, '../mongodb.log')
          ]);
          
          processes.mongodb = mongod;
          
          mongod.on('error', (error) => {
            console.error(`Failed to start MongoDB: ${error.message}`);
            
            // If MongoDB needs sudo, suggest that to the user
            if (error.message.includes('permission denied')) {
              console.error('You may need to run MongoDB with sudo permissions.');
              console.error('Try: sudo mongod --dbpath ./data/db --fork --logpath ./data/mongodb.log');
            }
            
            process.exit(1);
          });
          
          mongod.stderr.on('data', (data) => {
            const errorMsg = data.toString();
            console.error(`MongoDB error: ${errorMsg}`);
            
            // If MongoDB is already running, continue
            if (errorMsg.includes('Address already in use') || 
                errorMsg.includes('already running')) {
              console.log('MongoDB is already running on a different process');
              resolve();
            }
          });
          
          // Give MongoDB a moment to start
          setTimeout(() => {
            console.log('MongoDB started successfully (forked mode)');
            console.log(`MongoDB URL: mongodb://localhost:${config.mongodb.port}/${config.mongodb.dbName}`);
            resolve();
          }, 1000);
        });
      } else {
        // MongoDB is already running
        console.log('MongoDB is already running');
        console.log(`MongoDB URL: mongodb://localhost:${config.mongodb.port}/${config.mongodb.dbName}`);
        resolve();
      }
    });
  });
}

/**
 * Create TypeScript API server file
 */
function createAPIServerFile(): Promise<void> {
  console.log('\n=== Creating TypeScript API Server ===');
  
  return new Promise((resolve) => {
    const apiServerPath = path.join(__dirname, 'api-server.ts');
    
    const apiServerContent = `
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

// Create Express app
const app = express();
const port = ${config.api.port};

// Middleware
app.use(express.json());
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// MongoDB Connection
async function connectToMongoDB(): Promise<void> {
  console.log('Connecting to MongoDB...');
  
  try {
    // Connect to MongoDB
    const uri = 'mongodb://localhost:${config.mongodb.port}/${config.mongodb.dbName}';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully');
    
    // Check if we need to create sample data
    const count = await Customer.countDocuments();
    console.log(\`Database contains \${count} customers\`);
    
    if (count === 0) {
      console.log('Creating sample data...');
      await createSampleData();
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Customer schema
const CustomerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  status: { type: String, default: 'ACTIVE' },
  notes: String
}, { timestamps: true });

// Add virtual property for name
CustomerSchema.virtual('name').get(function() {
  return \`\${this.firstName} \${this.lastName}\`;
});

// Make virtuals accessible in JSON
CustomerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Register model
const Customer = mongoose.model('Customer', CustomerSchema);

// Create sample data
async function createSampleData(): Promise<void> {
  const sampleCustomers = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '123-456-7890',
      status: 'ACTIVE',
      notes: 'Regular customer'
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '987-654-3210',
      status: 'ACTIVE',
      notes: 'VIP customer'
    }
  ];
  
  await Customer.insertMany(sampleCustomers);
  console.log(\`Created \${sampleCustomers.length} sample customers\`);
}

// API Endpoints

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({
      status: 'success',
      data: customers,
      meta: {
        pagination: {
          page: 1,
          limit: customers.length,
          total: customers.length,
          pages: 1
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Create customer
app.post('/api/customers', async (req, res) => {
  try {
    console.log('Creating customer:', req.body);
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json({
      status: 'success',
      data: savedCustomer
    });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    res.status(400).json({
      status: 'error',
      error: error.message
    });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const result = await Customer.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        status: 'error',
        error: 'Customer not found'
      });
    }
    res.json({
      status: 'success',
      message: 'Customer deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Start everything
async function main(): Promise<void> {
  try {
    console.log('======================================');
    console.log('MontPC CRM - API Server');
    console.log('======================================');
    
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Start server
    app.listen(port, () => {
      console.log(\`API Server running at http://localhost:\${port}/api\`);
      console.log('API server is ready');
    });
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
}

main();
`;
    
    writeFileSync(apiServerPath, apiServerContent);
    console.log(`Created TypeScript API server at: ${apiServerPath}`);
    resolve();
  });
}

/**
 * Start API server
 */
function startAPIServer(): Promise<void> {
  console.log('\n=== Starting API Server ===');
  
  return new Promise((resolve, reject) => {
    console.log('Checking for required dependencies...');
    
    // First check if we have all required dependencies
    const checkDeps = spawn('npm', ['list', '--depth=0', 'express', 'mongoose', 'cors', 'typescript', 'ts-node', '@types/express', '@types/mongoose', '@types/cors', '@types/node']);
    
    let output = '';
    
    checkDeps.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    checkDeps.stderr.on('data', (data) => {
      // npm list shows ENOENT errors for missing packages
      console.log(`Checking dependencies: ${data.toString()}`);
    });
    
    checkDeps.on('close', () => {
      const missingDeps = [];
      
      // Check each dependency
      if (!output.includes('express@')) missingDeps.push('express');
      if (!output.includes('mongoose@')) missingDeps.push('mongoose');
      if (!output.includes('cors@')) missingDeps.push('cors');
      if (!output.includes('typescript@')) missingDeps.push('typescript');
      if (!output.includes('ts-node@')) missingDeps.push('ts-node');
      if (!output.includes('@types/express@')) missingDeps.push('@types/express');
      if (!output.includes('@types/mongoose@')) missingDeps.push('@types/mongoose');
      if (!output.includes('@types/cors@')) missingDeps.push('@types/cors');
      if (!output.includes('@types/node@')) missingDeps.push('@types/node');
      
      // If we have missing dependencies, install them
      if (missingDeps.length > 0) {
        console.log(`Installing missing dependencies: ${missingDeps.join(', ')}...`);
        
        const install = spawn('npm', ['install', '--no-save', ...missingDeps]);
        
        install.stdout.on('data', (data) => {
          console.log(`npm install: ${data}`);
        });
        
        install.stderr.on('data', (data) => {
          console.error(`npm install error: ${data}`);
        });
        
        install.on('close', (code) => {
          if (code !== 0) {
            console.error('Failed to install dependencies');
            reject(new Error('Failed to install dependencies'));
            return;
          }
          
          console.log('Dependencies installed successfully. Starting API server...');
          startApiProcess().then(resolve).catch(reject);
        });
      } else {
        console.log('All dependencies are already installed. Starting API server...');
        startApiProcess().then(resolve).catch(reject);
      }
    });
  });
}

/**
 * Start the API process using ts-node
 */
function startApiProcess(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Use ts-node to run the TypeScript file directly
    console.log('Starting API server using ts-node...');
    const apiServer = spawn('npx', ['ts-node', 'api-server.ts']);
    
    processes.api = apiServer;
    
    let started = false;
    
    apiServer.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`API: ${output}`);
      
      // Check for successful startup message
      if (output.includes('API Server running') && !started) {
        started = true;
        console.log(`API Server started successfully on http://localhost:${config.api.port}/api`);
        resolve();
      }
    });
    
    apiServer.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      console.error(`API Error: ${errorOutput}`);
      
      // Handle specific error cases
      if (errorOutput.includes('Error: listen EADDRINUSE')) {
        console.error(`Port ${config.api.port} is already in use.`);
        console.error('Another instance of the API server may be running.');
        console.error(`Try killing the process using: npx kill-port ${config.api.port}`);
        reject(new Error(`Port ${config.api.port} is already in use`));
      }
    });
    
    apiServer.on('error', (error) => {
      console.error(`Failed to start API server: ${error.message}`);
      reject(error);
    });
    
    // Set a timeout in case the server doesn't start
    const timeout = setTimeout(() => {
      if (!started) {
        console.error('API server failed to start within the timeout period');
        apiServer.kill();
        reject(new Error('API server startup timeout'));
      }
    }, 10000); // 10 second timeout
    
    // Clear the timeout when the server starts
    apiServer.on('exit', (code) => {
      clearTimeout(timeout);
      if (code !== 0 && !started) {
        console.error(`API server exited with code ${code}`);
        reject(new Error(`API server exited with code ${code}`));
      }
    });
  });
}

/**
 * Start Vue.js frontend
 */
function startFrontend(): Promise<void> {
  console.log('\n=== Starting Vue.js Frontend ===');
  
  return new Promise((resolve, reject) => {
    // Check if frontend directory exists
    if (!existsSync(config.frontend.srcPath)) {
      console.error(`Frontend directory does not exist: ${config.frontend.srcPath}`);
      reject(new Error(`Frontend directory does not exist: ${config.frontend.srcPath}`));
      return;
    }
    
    // Check if package.json exists
    const packageJsonPath = path.join(config.frontend.srcPath, 'package.json');
    if (!existsSync(packageJsonPath)) {
      console.error(`Frontend package.json does not exist: ${packageJsonPath}`);
      reject(new Error(`Frontend package.json does not exist: ${packageJsonPath}`));
      return;
    }
    
    // First, check if dev:vue script exists in package.json
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      const hasDevVueScript = packageJson.scripts && packageJson.scripts['dev:vue'];
      
      if (!hasDevVueScript) {
        console.warn('Warning: dev:vue script not found in package.json');
        console.warn('Falling back to "npm run dev" command');
        
        // Try using npm run dev instead
        runFrontendDev().then(resolve).catch(reject);
      } else {
        // Run the dev:vue script
        runFrontendDevVue().then(resolve).catch(reject);
      }
    } catch (error) {
      console.error('Error checking package.json scripts:', error);
      console.warn('Falling back to "npm run dev" command');
      
      // Try using npm run dev as a fallback
      runFrontendDev().then(resolve).catch(reject);
    }
  });
}

/**
 * Run the Vue.js frontend with dev:vue script
 */
function runFrontendDevVue(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Starting Vue.js frontend using npm run dev:vue...');
    
    // Install dependencies if needed
    console.log('Checking frontend dependencies...');
    
    const npmInstall = spawn('npm', ['install'], {
      cwd: config.frontend.srcPath,
      shell: true,
    });
    
    npmInstall.stdout.on('data', (data) => {
      console.log(`Frontend npm install: ${data}`);
    });
    
    npmInstall.stderr.on('data', (data) => {
      console.error(`Frontend npm install error: ${data}`);
    });
    
    npmInstall.on('close', (code) => {
      if (code !== 0) {
        console.warn(`npm install exited with code ${code}, but continuing anyway...`);
      }
      
      // Change to frontend directory and run dev server
      const frontend = spawn('npm', ['run', 'dev:vue'], {
        cwd: config.frontend.srcPath,
        shell: true,
      });
      
      processes.frontend = frontend;
      
      let started = false;
      
      frontend.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`Frontend: ${output}`);
        
        if ((output.includes('Local:') || output.includes('ready in')) && !started) {
          started = true;
          
          // Extract the actual URL
          let localUrl = 'http://localhost:5173';
          const localMatch = output.match(/Local:\s+(http:\/\/localhost:[0-9]+)/);
          if (localMatch && localMatch[1]) {
            localUrl = localMatch[1];
          }
          
          console.log(`Vue.js frontend started successfully at ${localUrl}`);
          resolve();
        }
      });
      
      frontend.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        console.error(`Frontend Error: ${errorOutput}`);
        
        if (errorOutput.includes('EADDRINUSE')) {
          console.error(`Port ${config.frontend.port} is already in use.`);
          console.error('Another instance of the frontend server may be running.');
          reject(new Error(`Port ${config.frontend.port} is already in use`));
        }
      });
      
      frontend.on('error', (error) => {
        console.error(`Failed to start frontend: ${error.message}`);
        reject(error);
      });
      
      // Set a timeout in case the server doesn't start
      const timeout = setTimeout(() => {
        if (!started) {
          console.error('Frontend server failed to start within the timeout period');
          frontend.kill();
          reject(new Error('Frontend server startup timeout'));
        }
      }, 60000); // 60 second timeout (first run can be slow due to Vite)
      
      // Clear the timeout when the server starts or exits
      frontend.on('exit', (code) => {
        clearTimeout(timeout);
        if (code !== 0 && !started) {
          console.error(`Frontend exited with code ${code}`);
          reject(new Error(`Frontend exited with code ${code}`));
        }
      });
    });
  });
}

/**
 * Run the Vue.js frontend with dev script (fallback)
 */
function runFrontendDev(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Starting Vue.js frontend using npm run dev (fallback)...');
    
    // Install dependencies if needed
    console.log('Checking frontend dependencies...');
    
    const npmInstall = spawn('npm', ['install'], {
      cwd: config.frontend.srcPath,
      shell: true,
    });
    
    npmInstall.stdout.on('data', (data) => {
      console.log(`Frontend npm install: ${data}`);
    });
    
    npmInstall.stderr.on('data', (data) => {
      console.error(`Frontend npm install error: ${data}`);
    });
    
    npmInstall.on('close', (code) => {
      if (code !== 0) {
        console.warn(`npm install exited with code ${code}, but continuing anyway...`);
      }
      
      // Change to frontend directory and run dev server
      const frontend = spawn('npm', ['run', 'dev'], {
        cwd: config.frontend.srcPath,
        shell: true,
      });
      
      processes.frontend = frontend;
      
      let started = false;
      
      frontend.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`Frontend: ${output}`);
        
        if ((output.includes('Local:') || output.includes('ready in')) && !started) {
          started = true;
          
          // Extract the actual URL
          let localUrl = 'http://localhost:5173';
          const localMatch = output.match(/Local:\s+(http:\/\/localhost:[0-9]+)/);
          if (localMatch && localMatch[1]) {
            localUrl = localMatch[1];
          }
          
          console.log(`Vue.js frontend started successfully at ${localUrl}`);
          resolve();
        }
      });
      
      frontend.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        console.error(`Frontend Error: ${errorOutput}`);
        
        if (errorOutput.includes('EADDRINUSE')) {
          console.error(`Port ${config.frontend.port} is already in use.`);
          console.error('Another instance of the frontend server may be running.');
          reject(new Error(`Port ${config.frontend.port} is already in use`));
        }
      });
      
      frontend.on('error', (error) => {
        console.error(`Failed to start frontend: ${error.message}`);
        reject(error);
      });
      
      // Set a timeout in case the server doesn't start
      const timeout = setTimeout(() => {
        if (!started) {
          console.error('Frontend server failed to start within the timeout period');
          frontend.kill();
          reject(new Error('Frontend server startup timeout'));
        }
      }, 60000); // 60 second timeout (first run can be slow due to Vite)
      
      // Clear the timeout when the server starts or exits
      frontend.on('exit', (code) => {
        clearTimeout(timeout);
        if (code !== 0 && !started) {
          console.error(`Frontend exited with code ${code}`);
          reject(new Error(`Frontend exited with code ${code}`));
        }
      });
    });
  });
}

/**
 * Handle graceful shutdown of all services
 */
function setupCleanup(): void {
  const cleanup = async (): Promise<void> => {
    console.log('\n\nShutting down all services...');
    
    // Track any errors during shutdown
    const errors: Error[] = [];
    
    // Shutdown frontend
    if (processes.frontend) {
      try {
        console.log('Stopping Vue.js frontend...');
        processes.frontend.kill('SIGTERM');
        
        // Give it a moment to terminate gracefully
        await new Promise(r => setTimeout(r, 1000));
        
        // Force kill if still running
        if (!processes.frontend.killed) {
          processes.frontend.kill('SIGKILL');
        }
        
        console.log('Frontend stopped');
      } catch (error) {
        console.error('Error stopping frontend:', error);
        errors.push(error instanceof Error ? error : new Error(String(error)));
      }
    }
    
    // Shutdown API server
    if (processes.api) {
      try {
        console.log('Stopping API server...');
        processes.api.kill('SIGTERM');
        
        // Give it a moment to terminate gracefully
        await new Promise(r => setTimeout(r, 1000));
        
        // Force kill if still running
        if (!processes.api.killed) {
          processes.api.kill('SIGKILL');
        }
        
        console.log('API server stopped');
      } catch (error) {
        console.error('Error stopping API server:', error);
        errors.push(error instanceof Error ? error : new Error(String(error)));
      }
    }
    
    // Shutdown MongoDB
    try {
      console.log('Stopping MongoDB...');
      
      // The proper way to shut down MongoDB
      const mongoShutdown = spawn('mongod', ['--shutdown']);
      
      // Wait for MongoDB to shut down
      await new Promise<void>((resolve) => {
        mongoShutdown.on('close', (code) => {
          if (code !== 0) {
            console.warn(`MongoDB shutdown command exited with code ${code}`);
          }
          resolve();
        });
        
        // If it takes too long, resolve anyway
        setTimeout(resolve, 5000);
      });
      
      // If we started MongoDB directly, also kill that process
      if (processes.mongodb) {
        processes.mongodb.kill('SIGTERM');
        
        // Give it a moment
        await new Promise(r => setTimeout(r, 1000));
        
        // Force kill if needed
        if (!processes.mongodb.killed) {
          processes.mongodb.kill('SIGKILL');
        }
      }
      
      console.log('MongoDB stopped');
    } catch (error) {
      console.error('Error stopping MongoDB:', error);
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }
    
    // Clean up any port-blocking processes
    try {
      console.log('Cleaning up any remaining processes...');
      
      const killPort = spawn('npx', ['kill-port', 
        config.api.port.toString(), 
        config.frontend.port.toString(),
        config.mongodb.port.toString()
      ]);
      
      // Wait for kill-port to finish
      await new Promise<void>((resolve) => {
        killPort.on('close', () => resolve());
        
        // If it takes too long, resolve anyway
        setTimeout(resolve, 5000);
      });
    } catch (error) {
      console.error('Error cleaning up processes:', error);
      // Don't add to errors array, as this is just an extra cleanup step
    }
    
    if (errors.length > 0) {
      console.error(`\nShutdown completed with ${errors.length} errors:`);
      errors.forEach((error, index) => {
        console.error(`${index + 1}. ${error.message}`);
      });
    } else {
      console.log('\nAll services stopped successfully');
    }
    
    // Exit the process
    process.exit(errors.length > 0 ? 1 : 0);
  };
  
  // Handle Ctrl+C
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

/**
 * Main function to start all services
 */
async function startAll(): Promise<void> {
  console.log('\n===========================================');
  console.log('🚀 MontPC CRM - TypeScript Application Starter');
  console.log('===========================================\n');
  
  try {
    // Setup cleanup handlers
    setupCleanup();
    
    // Kill any processes on the ports we need
    await killPortProcesses();
    
    // Start MongoDB first
    await startMongoDB();
    
    // Create TypeScript API server file
    await createAPIServerFile();
    
    // Start API server
    await startAPIServer();
    
    // Start Vue.js frontend
    await startFrontend();
    
    console.log('\n\n===========================================');
    console.log('✅ All services started successfully:');
    console.log(`- MongoDB: mongodb://localhost:${config.mongodb.port}/${config.mongodb.dbName}`);
    console.log(`- API Server: http://localhost:${config.api.port}/api`);
    console.log(`- Vue.js Frontend: http://localhost:${config.frontend.port}`);
    console.log('===========================================\n');
    console.log('Press Ctrl+C to stop all services');
  } catch (error) {
    console.error('Failed to start services:', error);
    process.exit(1);
  }
}

// Start everything
startAll();