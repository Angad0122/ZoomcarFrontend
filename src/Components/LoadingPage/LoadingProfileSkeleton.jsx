import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LoadingSkeleton = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#e0e0e0', // Slightly darker background for better contrast
      }}
    >
      {/* Navbar Skeleton */}
      <div
        style={{
          height: '60px',
          width: '100%',
          padding: '10px 20px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Navbar Logo */}
        <Skeleton
          height={30}
          width={150}
          baseColor="#c4c4c4"
          highlightColor="#d6d6d6"
        />
        {/* Navbar Links */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <Skeleton
            height={20}
            width={100}
            baseColor="#c4c4c4"
            highlightColor="#d6d6d6"
          />
          <Skeleton
            height={20}
            width={80}
            baseColor="#c4c4c4"
            highlightColor="#d6d6d6"
          />
          <Skeleton
            height={20}
            width={120}
            baseColor="#c4c4c4"
            highlightColor="#d6d6d6"
          />
        </div>
      </div>

      {/* Content Section */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Skeleton */}
        <div
          style={{
            width: '300px',
            padding: '20px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Profile Picture */}
          <Skeleton
            circle={true}
            height={80}
            width={80}
            baseColor="#c4c4c4"
            highlightColor="#d6d6d6"
            style={{ marginBottom: '10px' }}
          />
          <Skeleton
            height={20}
            width={200}
            baseColor="#c4c4c4"
            highlightColor="#d6d6d6"
            style={{ marginBottom: '10px' }}
          />
          <Skeleton
            height={15}
            width={150}
            baseColor="#c4c4c4"
            highlightColor="#d6d6d6"
            style={{ marginBottom: '20px' }}
          />
          <div>
            <Skeleton
              height={20}
              width={250}
              count={6}
              baseColor="#c4c4c4"
              highlightColor="#d6d6d6"
              style={{ marginBottom: '10px' }}
            />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div style={{ flex: 1, padding: '20px' }}>
          {/* Heading */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <Skeleton
              height={30}
              width={300}
              baseColor="#c4c4c4"
              highlightColor="#d6d6d6"
            />
          </div>

          {/* Account Information Section */}
          <div
            style={{
              width: '100%',
              marginBottom: '40px', // Good gap between sections
            }}
          >
            <Skeleton
              height={20}
              width={100}
              style={{ marginBottom: '10px' }}
              baseColor="#c4c4c4"
              highlightColor="#d6d6d6"
            />
            <Skeleton
              height={20}
              width={400}
              baseColor="#c4c4c4"
              highlightColor="#d6d6d6"
            />
          </div>

          {/* Personal Details Section */}
          <div
            style={{
              width: '100%',
              marginBottom: '40px', // Good gap between sections
            }}
          >
            <Skeleton
              height={20}
              width={100}
              style={{ marginBottom: '10px' }}
              baseColor="#c4c4c4"
              highlightColor="#d6d6d6"
            />
            <Skeleton
              height={20}
              width={300}
              baseColor="#c4c4c4"
              highlightColor="#d6d6d6"
            />
            <Skeleton
              height={20}
              width={200}
              style={{ marginTop: '10px' }}
              baseColor="#c4c4c4"
              highlightColor="#d6d6d6"
            />
          </div>

          {/* Update Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Skeleton
              height={40}
              width={120}
              baseColor="#c4c4c4"
              highlightColor="#d6d6d6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
