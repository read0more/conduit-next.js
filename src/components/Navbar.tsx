import React from 'react';
import Container from './Container';
import Link from 'next/link';
import styled from 'styled-components';
import { useUser } from 'src/lib/client/UserProvider';
import { useRouter } from 'next/router';
import CreateArticle from './icons/CreateArticle';
import Settings from './icons/Settings';
import Image from 'next/image';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #5cb85c;
  margin: 0;
`;

const Ul = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1em;
`;

type LiProps = {
  selected?: boolean;
};

const Li = styled.li<LiProps>`
  color: ${({ selected }) => (selected ? 'black' : 'lightgrey')};
`;

type Menu = {
  name: string;
  href: string;
  icon?: (selected: boolean) => React.ReactNode;
};

export default function Navbar() {
  const { user, isLoading } = useUser();
  const { pathname } = useRouter();
  const loggedInMenu: Menu[] = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'New Article',
      href: '/editor',
      icon: (selected) => <CreateArticle selected={selected} />,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: (selected) => <Settings selected={selected} />,
    },
    {
      name: user?.username ?? '',
      href: `/${user?.username}`,
      icon: () => (
        <Image
          src="https://api.realworld.io/images/smiley-cyrus.jpeg"
          alt="user avatar"
          width={30}
          height={30}
          style={{ borderRadius: '50%', marginRight: '0.5em' }}
        />
      ),
    },
  ];

  const loggedOutMenu: Menu[] = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Sign in',
      href: '/login',
    },
    {
      name: 'Sign up',
      href: '/register',
    },
  ];

  const menu = user ? loggedInMenu : loggedOutMenu;

  return (
    <Container>
      <Nav>
        <Link href="/">
          <Title>conduit</Title>
        </Link>
        <Ul>
          {menu.map((item) => (
            <Li key={item.name} selected={pathname === item.href}>
              <Link
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item?.icon ? item.icon(pathname === item.href) : ''}
                {item.name}
              </Link>
            </Li>
          ))}
        </Ul>
      </Nav>
    </Container>
  );
}
