# CUDA Backend for GPU Acceleration

## Prerequisites

1. **NVIDIA GPU** with CUDA support (Compute Capability 7.0+)
2. **CUDA Toolkit** 11.0 or newer
3. **cuDNN** library

## Installation

### 1. Install CUDA Toolkit

**Ubuntu/Debian:**
```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install cuda-toolkit-12-3
```

**Verify installation:**
```bash
nvcc --version
nvidia-smi
```

### 2. Install cuDNN

Download from: https://developer.nvidia.com/cudnn

```bash
sudo dpkg -i cudnn-local-repo-*.deb
sudo cp /var/cudnn-local-repo-*/cudnn-local-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get install libcudnn8 libcudnn8-dev
```

## Building with CUDA Support

```bash
# Build with CUDA backend
cargo build --release --features cuda

# Run coordinator with CUDA
cargo run --release --features cuda --bin monero-predict

# Run benchmarks with CUDA
cargo run --release --features cuda --bin benchmark
```

## Performance Expectations

With CUDA backend on a modern GPU (e.g., RTX 4090):
- **10,000 bets**: Expected ~3-5 seconds (vs ~30-60 minutes on CPU)
- **100,000 bets**: Expected ~30-60 seconds
- **1,000,000 bets**: Expected ~5-10 minutes

The CUDA backend provides ~100-200x speedup for FHE operations.

## Benchmark Comparison

**CPU (12-core AMD Ryzen 9):**
- Encrypting a bet: ~4ms
- 1,000 bets: ~4 seconds
- 10,000 bets: ~35-60 seconds

**GPU (NVIDIA RTX 4090) - Expected:**
- Encrypting a bet: ~4ms (same, CPU-bound)
- 1,000 bets: ~500ms
- 10,000 bets: ~3-5 seconds

## Troubleshooting

### CUDA not found

```bash
export CUDA_HOME=/usr/local/cuda
export PATH=$CUDA_HOME/bin:$PATH
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
```

### Out of GPU memory

Reduce batch size or use a GPU with more VRAM:
- RTX 3090: 24GB (good for ~50,000 bets)
- RTX 4090: 24GB (good for ~50,000 bets)
- A100: 40GB/80GB (good for ~100,000+ bets)

### Performance not improving

- Verify GPU is being used: `nvidia-smi` should show GPU utilization
- Check TFHE-rs is using GPU: Look for "CUDA backend enabled" message
- Ensure data transfer overhead isn't dominating (use larger batch sizes)

## Cloud GPU Options

**AWS:**
- `g4dn.xlarge` - T4 GPU, $0.526/hour
- `p3.2xlarge` - V100 GPU, $3.06/hour
- `p4d.24xlarge` - A100 GPU, $32.77/hour

**Google Cloud:**
- `n1-standard-4` + T4 GPU - ~$0.50/hour
- `a2-highgpu-1g` - A100 GPU - ~$4/hour

**Vast.ai / Lambda Labs:**
- RTX 3090: ~$0.30/hour
- RTX 4090: ~$0.60/hour
- A100: ~$1.50/hour
