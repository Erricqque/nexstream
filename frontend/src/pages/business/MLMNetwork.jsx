import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const MLMNetwork = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [networkData, setNetworkData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadNetworkData();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadNetworkData = async () => {
    try {
      // Mock binary tree data
      setNetworkData({
        id: 1,
        name: 'You',
        avatar: null,
        level: 3,
        earnings: 12500,
        left: {
          id: 2,
          name: 'John Doe',
          avatar: null,
          level: 2,
          earnings: 5600,
          left: {
            id: 4,
            name: 'Alice Smith',
            avatar: null,
            level: 1,
            earnings: 1200,
            left: null,
            right: null
          },
          right: {
            id: 5,
            name: 'Bob Johnson',
            avatar: null,
            level: 1,
            earnings: 980,
            left: null,
            right: null
          }
        },
        right: {
          id: 3,
          name: 'Jane Wilson',
          avatar: null,
          level: 2,
          earnings: 4300,
          left: {
            id: 6,
            name: 'Carol Brown',
            avatar: null,
            level: 1,
            earnings: 850,
            left: null,
            right: null
          },
          right: {
            id: 7,
            name: 'David Lee',
            avatar: null,
            level: 1,
            earnings: 720,
            left: null,
            right: null
          }
        }
      });
    } catch (error) {
      console.error('Error loading network data:', error);
    } finally {
      setLoading(false);
    }
  };

  const TreeNode = ({ node, x, y, level = 0 }) => {
    if (!node) return null;

    const nodeSize = isMobile ? 60 : 80;
    const horizontalSpacing = isMobile ? 120 : 200;
    const verticalSpacing = isMobile ? 80 : 100;

    return (
      <>
        {/* Node */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: level * 0.1 }}
          onClick={() => setSelectedNode(node)}
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx={x}
            cy={y}
            r={nodeSize / 2}
            fill={node.id === 1 ? '#FF3366' : '#4FACFE'}
            stroke={selectedNode?.id === node.id ? '#FFD700' : 'none'}
            strokeWidth="3"
          />
          <text
            x={x}
            y={y - nodeSize / 2 - 10}
            textAnchor="middle"
            fill="#888"
            fontSize="12"
          >
            {node.name}
          </text>
          <text
            x={x}
            y={y}
            textAnchor="middle"
            fill="white"
            fontSize={isMobile ? '10' : '12'}
            dy=".3em"
          >
            Level {node.level}
          </text>
          <text
            x={x}
            y={y + nodeSize / 2 + 15}
            textAnchor="middle"
            fill="#43E97B"
            fontSize="10"
          >
            ${node.earnings}
          </text>
        </motion.g>

        {/* Lines to children */}
        {node.left && (
          <>
            <line
              x1={x}
              y1={y + nodeSize / 2}
              x2={x - horizontalSpacing / 2}
              y2={y + verticalSpacing - nodeSize / 2}
              stroke="#333"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <TreeNode
              node={node.left}
              x={x - horizontalSpacing / 2}
              y={y + verticalSpacing}
              level={level + 1}
            />
          </>
        )}

        {node.right && (
          <>
            <line
              x1={x}
              y1={y + nodeSize / 2}
              x2={x + horizontalSpacing / 2}
              y2={y + verticalSpacing - nodeSize / 2}
              stroke="#333"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <TreeNode
              node={node.right}
              x={x + horizontalSpacing / 2}
              y={y + verticalSpacing}
              level={level + 1}
            />
          </>
        )}
      </>
    );
  };

  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem'
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #FF3366',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xl,
          flexWrap: 'wrap',
          gap: spacing.md
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? fontSize.xl : fontSize.xxl,
              marginBottom: spacing.xs
            }}>
              MLM Network Tree
            </h1>
            <p style={{ color: '#888' }}>
              Visualize your downline structure
            </p>
          </div>
          <button
            onClick={() => navigate('/business')}
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              background: 'transparent',
              border: '1px solid #FF3366',
              borderRadius: '20px',
              color: '#FF3366',
              cursor: 'pointer',
              fontSize: fontSize.sm
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Tree View */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl,
          overflowX: 'auto',
          minHeight: '600px'
        }}>
          <svg
            width="100%"
            height="600"
            viewBox={isMobile ? "0 0 400 600" : "0 0 800 600"}
            preserveAspectRatio="xMidYMid meet"
          >
            <TreeNode node={networkData} x={isMobile ? 200 : 400} y={50} />
          </svg>
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: spacing.xl,
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.lg
            }}
          >
            <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>
              Member Details
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: spacing.lg
            }}>
              <div>
                <p style={{ color: '#888', marginBottom: spacing.xs }}>Name</p>
                <p style={{ fontSize: fontSize.md }}>{selectedNode.name}</p>
              </div>
              <div>
                <p style={{ color: '#888', marginBottom: spacing.xs }}>Level</p>
                <p style={{ fontSize: fontSize.md }}>{selectedNode.level}</p>
              </div>
              <div>
                <p style={{ color: '#888', marginBottom: spacing.xs }}>Total Earnings</p>
                <p style={{ fontSize: fontSize.md, color: '#43E97B' }}>
                  ${selectedNode.earnings}
                </p>
              </div>
              <div>
                <p style={{ color: '#888', marginBottom: spacing.xs }}>Downline Size</p>
                <p style={{ fontSize: fontSize.md }}>
                  {selectedNode.left && selectedNode.right ? 2 : selectedNode.left || selectedNode.right ? 1 : 0}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MLMNetwork;