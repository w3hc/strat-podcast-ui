import { useToast, Box, Stack, HStack, Heading, Text, VStack, useColorModeValue, List, ListItem, ListIcon, Button } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'
import { useState, useEffect } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../utils/nft'
import { useEthersSigner, useEthersProvider } from '../hooks/ethersAdapter'
import { FaCheckCircle } from 'react-icons/fa'

interface Props {
  children: React.ReactNode
}

function PriceWrapper(props: Props) {
  const { children } = props

  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'xl'}>
      {children}
    </Box>
  )
}

export default function Home() {
  const { chains, error, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const provider = useEthersProvider()
  const signer = useEthersSigner()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()

  useEffect(() => {
    const init = async () => {
      if (chain?.id !== 10243) {
        switchNetwork?.(10243)
      }
    }
    init()
    console.log('isConnected:', isConnected)
    console.log('network:', chain?.name)
    console.log('signer:', signer)
    console.log('provider:', provider)
  }, [signer])

  const mint = async () => {
    try {
      if (!signer) {
        toast({
          title: 'No wallet',
          description: 'Please connect your wallet first.',
          status: 'error',
          position: 'bottom',
          variant: 'subtle',
          duration: 9000,
          isClosable: true,
        })
        return
      }
      setIsLoading(true)
      setTxHash('')
      setTxLink('')
      const nft = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)
      const call = await nft.safeMint(signer.address)
      const receipt = await call.wait()
      console.log('tx:', receipt)
      setTxHash(receipt.hash)
      setTxLink('https://explorer-test.arthera.net/tx/' + receipt.hash)
      setIsLoading(false)
      toast({
        title: 'Successful mint',
        description: 'Congrats, your NFT was minted! 🎉',
        status: 'success',
        position: 'bottom',
        variant: 'subtle',
        duration: 20000,
        isClosable: true,
      })
    } catch (e) {
      setIsLoading(false)
      console.log('error:', e)
      toast({
        title: 'Woops',
        description: 'Something went wrong during the minting process...',
        status: 'error',
        position: 'bottom',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">Strat 🌈</HeadingComponent>
        <Button
          mt={4}
          colorScheme="blue"
          variant="outline"
          type="submit"
          onClick={mint}
          isLoading={isLoading}
          loadingText="Minting..."
          spinnerPlacement="end">
          Mint
        </Button>
        {txHash && (
          <Text py={4} fontSize="14px" color="#45a2f8">
            <LinkComponent href={txLink ? txLink : ''}>{txHash}</LinkComponent>
          </Text>
        )}

        <Box py={12}>
          <VStack spacing={2} textAlign="center">
            <Heading as="h1" fontSize="4xl">
              Plans that fit your need
            </Heading>
            <Text fontSize="lg" color={'gray.500'}>
              Start with 14-day free trial. No credit card needed. Cancel at anytime.
            </Text>
          </VStack>
          <Stack direction={{ base: 'column', md: 'row' }} textAlign="center" justify="center" spacing={{ base: 4, lg: 10 }} py={10}>
            <PriceWrapper>
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="2xl">
                  Hobby
                </Text>
                <HStack justifyContent="center">
                  <Text fontSize="3xl" fontWeight="600">
                    $
                  </Text>
                  <Text fontSize="5xl" fontWeight="900">
                    79
                  </Text>
                  <Text fontSize="3xl" color="gray.500">
                    /month
                  </Text>
                </HStack>
              </Box>
              <VStack bg={useColorModeValue('gray.50', 'gray.700')} py={4} borderBottomRadius={'xl'}>
                <List spacing={3} textAlign="start" px={12}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    unlimited build minutes
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Lorem, ipsum dolor.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    5TB Lorem, ipsum dolor.
                  </ListItem>
                </List>
                <Box w="80%" pt={7}>
                  <Button w="full" colorScheme="red" variant="outline">
                    Start trial
                  </Button>
                </Box>
              </VStack>
            </PriceWrapper>

            <PriceWrapper>
              <Box position="relative">
                <Box position="absolute" top="-16px" left="50%" style={{ transform: 'translate(-50%)' }}>
                  <Text
                    textTransform="uppercase"
                    bg={useColorModeValue('red.300', 'red.700')}
                    px={3}
                    py={1}
                    color={useColorModeValue('gray.900', 'gray.300')}
                    fontSize="sm"
                    fontWeight="600"
                    rounded="xl">
                    Most Popular
                  </Text>
                </Box>
                <Box py={4} px={12}>
                  <Text fontWeight="500" fontSize="2xl">
                    Growth
                  </Text>
                  <HStack justifyContent="center">
                    <Text fontSize="3xl" fontWeight="600">
                      $
                    </Text>
                    <Text fontSize="5xl" fontWeight="900">
                      149
                    </Text>
                    <Text fontSize="3xl" color="gray.500">
                      /month
                    </Text>
                  </HStack>
                </Box>
                <VStack bg={useColorModeValue('gray.50', 'gray.700')} py={4} borderBottomRadius={'xl'}>
                  <List spacing={3} textAlign="start" px={12}>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      unlimited build minutes
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      Lorem, ipsum dolor.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      5TB Lorem, ipsum dolor.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      5TB Lorem, ipsum dolor.
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      5TB Lorem, ipsum dolor.
                    </ListItem>
                  </List>
                  <Box w="80%" pt={7}>
                    <Button w="full" colorScheme="red">
                      Start trial
                    </Button>
                  </Box>
                </VStack>
              </Box>
            </PriceWrapper>
            <PriceWrapper>
              <Box py={4} px={12}>
                <Text fontWeight="500" fontSize="2xl">
                  Scale
                </Text>
                <HStack justifyContent="center">
                  <Text fontSize="3xl" fontWeight="600">
                    $
                  </Text>
                  <Text fontSize="5xl" fontWeight="900">
                    349
                  </Text>
                  <Text fontSize="3xl" color="gray.500">
                    /month
                  </Text>
                </HStack>
              </Box>
              <VStack bg={useColorModeValue('gray.50', 'gray.700')} py={4} borderBottomRadius={'xl'}>
                <List spacing={3} textAlign="start" px={12}>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    unlimited build minutes
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    Lorem, ipsum dolor.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    5TB Lorem, ipsum dolor.
                  </ListItem>
                </List>
                <Box w="80%" pt={7}>
                  <Button w="full" colorScheme="red" variant="outline">
                    Start trial
                  </Button>
                </Box>
              </VStack>
            </PriceWrapper>
          </Stack>
        </Box>
      </main>
    </>
  )
}
